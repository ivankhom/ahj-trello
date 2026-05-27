const STORAGE_KEY = 'trello-state';

const defaultState = {
  columns: [
    { id: 'col-1', title: 'TODO', cards: [] },
    { id: 'col-2', title: 'IN PROGRESS', cards: [] },
    { id: 'col-3', title: 'DONE', cards: [] },
  ],
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
