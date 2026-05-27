import Card from './Card';

export default class Column {
  constructor(data, board) {
    this.data = { ...data };
    this.board = board;
    this.el = null;
    this.listEl = null;
    this.cards = [];
  }

  render() {
    this.el = document.createElement('div');
    this.el.classList.add('column');
    this.el.dataset.colId = this.data.id;
    this.el.innerHTML = `
      <div class="column-header">
        <span class="column-title">${this.data.title}</span>
      </div>
      <div class="card-list"></div>
      <div class="column-footer">
        <button class="btn-add-card">+ Add another card</button>
        <div class="add-card-form hidden">
          <textarea class="new-card-input" placeholder="Enter a title for this card…"></textarea>
          <div class="add-card-actions">
            <button class="btn-add-card-submit">Add Card</button>
            <button class="btn-add-card-cancel">✕</button>
          </div>
        </div>
      </div>
    `;

    this.listEl = this.el.querySelector('.card-list');
    this.data.cards.forEach((cardData) => this.addCard(cardData));

    this.el.querySelector('.btn-add-card').addEventListener('click', () => this.showForm());
    this.el.querySelector('.btn-add-card-cancel').addEventListener('click', () => this.hideForm());
    this.el.querySelector('.btn-add-card-submit').addEventListener('click', () => this.submitForm());
    this.el.querySelector('.new-card-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); this.submitForm(); }
      if (e.key === 'Escape') this.hideForm();
    });

    return this.el;
  }

  addCard(cardData) {
    const card = new Card(cardData, this.board);
    this.listEl.append(card.render());
    this.cards.push(card);
    return card;
  }

  showForm() {
    this.el.querySelector('.btn-add-card').classList.add('hidden');
    this.el.querySelector('.add-card-form').classList.remove('hidden');
    this.el.querySelector('.new-card-input').focus();
  }

  hideForm() {
    this.el.querySelector('.btn-add-card').classList.remove('hidden');
    this.el.querySelector('.add-card-form').classList.add('hidden');
    this.el.querySelector('.new-card-input').value = '';
  }

  submitForm() {
    const input = this.el.querySelector('.new-card-input');
    const text = input.value.trim();
    if (!text) return;
    const cardData = { id: `card-${Date.now()}`, text };
    this.addCard(cardData);
    this.board.save();
    this.hideForm();
  }

  getData() {
    return {
      id: this.data.id,
      title: this.data.title,
      cards: this.cards.map((c) => c.getData()),
    };
  }

  syncFromDOM() {
    const cardEls = this.listEl.querySelectorAll('.card');
    this.cards = Array.from(cardEls).map((el) => {
      const existing = this.board.columns
        .flatMap((col) => col.cards)
        .find((c) => c.el === el);
      if (existing) {
        existing.colId = this.data.id;
        return existing;
      }
      return null;
    }).filter(Boolean);
  }
}
