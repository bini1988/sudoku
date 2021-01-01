import './style.css';
import { solve } from './lib/sudoku-solver';

window.addEventListener('DOMContentLoaded', (event) => {
  const sudoku = document.getElementById('sudoku');
  const sudokuInputs = sudoku?.querySelectorAll<HTMLInputElement>('[data-row][data-col]');
  const sudokuInputsList = sudokuInputs ? Array.from(sudokuInputs) : [];

  const clearButton = document.getElementById('clear');
  const solveButton = document.getElementById('solve');

  clearButton?.addEventListener('click', () => {
    for (const input of sudokuInputsList) {
      input.value = "";
      input.classList.remove('sudoku__value--style-light');
    }
  })
  solveButton?.addEventListener('click', () => {
    const problem: number[][] = [];

    for (const input of sudokuInputsList) {
      const rowIndex = +(input.dataset.row || 0);
      const colIndex = +(input.dataset.col || 0);

      problem[rowIndex] = problem[rowIndex] || [];
      problem[rowIndex][colIndex] = +input.value;
    }

    const solution = solve(problem);

    for (const input of sudokuInputsList) {
      const rowIndex = +(input.dataset.row || 0);
      const colIndex = +(input.dataset.col || 0);

      input.value = `${solution[rowIndex][colIndex]}`;

      if (problem[rowIndex][colIndex] === 0) {
        input.classList.add('sudoku__value--style-light');
      }
    }
  })
});
