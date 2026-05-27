export default class Card {
  constructor(data, board) {
    this.data = { ...data };
    this.board = board;
    this.el = null;
  }

  render() {
    this.el = document.createElement('div');
    this.el.classList.add('card');
    this.el.dataset.cardId = this.data.id;
    this.el.innerHTML = `
      <button class="card-delete" title="Удалить карточку">✕</button>
      <div class="card-text">${this.escapeHtml(this.data.text)}</div>
    `;

    this.el.querySelector('.card-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      this.el.remove();
      this.board.syncStateFromDOM();
      this.board.save();
    });

    this.el.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('card-delete')) return;
      const colEl = this.el.closest('.column');
      const colId = colEl ? colEl.dataset.colId : null;
      this.board.startDrag(this.el, colId, this.data.id, e);
    });

    return this.el;
  }

  getData() {
    const textEl = this.el ? this.el.querySelector('.card-text') : null;
    return {
      id: this.data.id,
      text: textEl ? textEl.textContent : this.data.text,
    };
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
