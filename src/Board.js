import { loadState, saveState } from './Storage';
import Column from './Column';

export default class Board {
  constructor(container) {
    this.container = container;
    this.state = loadState();
    this.columns = [];
    this.dragging = null;
    this.placeholder = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  render() {
    this.container.innerHTML = '';
    this.columns = this.state.columns.map((colData) => {
      const col = new Column(colData, this);
      this.container.append(col.render());
      return col;
    });
  }

  save() {
    this.state.columns = this.columns.map((col) => col.getData());
    saveState(this.state);
  }

  startDrag(cardEl, colId, cardId, e) {
    const rect = cardEl.getBoundingClientRect();
    this.dragOffsetX = e.clientX - rect.left;
    this.dragOffsetY = e.clientY - rect.top;

    this.dragging = {
      el: cardEl,
      colId,
      cardId,
      width: rect.width,
      height: rect.height,
    };

    this.placeholder = document.createElement('div');
    this.placeholder.classList.add('card-placeholder');
    this.placeholder.style.height = `${rect.height}px`;

    cardEl.style.width = `${rect.width}px`;
    cardEl.style.position = 'fixed';
    cardEl.style.zIndex = '1000';
    cardEl.style.cursor = 'grabbing';
    cardEl.style.pointerEvents = 'none';
    cardEl.style.opacity = '0.9';
    cardEl.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';

    this.moveDragEl(e.clientX, e.clientY);

    cardEl.parentNode.insertBefore(this.placeholder, cardEl);
    document.body.append(cardEl);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  moveDragEl(clientX, clientY) {
    this.dragging.el.style.left = `${clientX - this.dragOffsetX}px`;
    this.dragging.el.style.top = `${clientY - this.dragOffsetY}px`;
  }

  onMouseMove(e) {
    if (!this.dragging) return;
    this.moveDragEl(e.clientX, e.clientY);
    this.updatePlaceholder(e.clientX, e.clientY);
  }

  updatePlaceholder(clientX, clientY) {
    const cardEls = document.elementsFromPoint(clientX, clientY);
    const targetCard = cardEls.find(
      (el) => el.classList.contains('card') && el !== this.dragging.el,
    );
    const targetList = cardEls.find((el) => el.classList.contains('card-list'));

    if (targetCard) {
      const rect = targetCard.getBoundingClientRect();
      const isAfter = clientY > rect.top + rect.height / 2;
      if (isAfter) {
        targetCard.parentNode.insertBefore(this.placeholder, targetCard.nextSibling);
      } else {
        targetCard.parentNode.insertBefore(this.placeholder, targetCard);
      }
    } else if (targetList) {
      targetList.append(this.placeholder);
    }
  }

  onMouseUp() {
    if (!this.dragging) return;

    const { el } = this.dragging;

    el.style.position = '';
    el.style.zIndex = '';
    el.style.left = '';
    el.style.top = '';
    el.style.width = '';
    el.style.cursor = '';
    el.style.pointerEvents = '';
    el.style.opacity = '';
    el.style.boxShadow = '';

    this.placeholder.parentNode.insertBefore(el, this.placeholder);
    this.placeholder.remove();
    this.placeholder = null;
    this.dragging = null;

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

    this.syncStateFromDOM();
    this.save();
  }

  syncStateFromDOM() {
    this.columns.forEach((col) => col.syncFromDOM());
  }
}
