import './style.css';
import Board from './Board';

const container = document.getElementById('board');
if (!container) throw new Error('Element #board not found');

const board = new Board(container);
board.render();
