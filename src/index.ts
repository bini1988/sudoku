import './style.css';
import { solve } from './lib/sudoku-solver';

const problem = [
  [0, 9, 5, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 7],
  [3, 4, 0, 5, 0, 0, 8, 0, 0],
  [4, 0, 0, 3, 0, 0, 0, 0, 5],
  [5, 0, 0, 0, 0, 0, 0, 8, 0],
  [7, 0, 1, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 8, 0, 4, 7, 0, 2],
  [0, 6, 0, 0, 9, 0, 5, 0, 8],
  [0, 0, 0, 0, 6, 0, 4, 0, 0],
];

console.log('Sudoku Solver!');
console.table(solve(problem));
