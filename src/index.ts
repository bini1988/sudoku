import 'regenerator-runtime/runtime';
import './styles/style.css';
import { captureSudoku } from './modules/sudoku-capture';
import { solveSudoku } from './modules/sudoku-solver';
import { query, queryAll, on } from './utils/dom';
import { loadImageFile, eachInput } from './utils/utils';

window.addEventListener('DOMContentLoaded', () => {
  const page = query<HTMLBodyElement>('.page');
  const capture = query<HTMLCanvasElement>('#capture');
  const canvas = query<HTMLCanvasElement>('#capture canvas');
  const sudokuInputs = queryAll<HTMLInputElement>('#sudoku [data-row][data-col]');

  on('#file', 'change', async ({ target }) => {
    if (target instanceof HTMLInputElement && target.files?.length && canvas) {
      const file = target.files[0];
      const ctx = canvas.getContext('2d');

      const cv = await window.cv;
      const img = await loadImageFile(file);

      canvas.width = img.width;
      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0, img.width, img.height);
      page?.setAttribute('data-view', 'capture');

      capture?.classList.add('capture--loading');

      const src = cv.imread(canvas);
      const dst = src.clone();

      await captureSudoku(src, dst);

      cv.imshow(canvas, dst);

      capture?.classList.remove('capture--loading');

      src.delete();
      dst.delete();
    }
  })

  on('#clear', 'click', () => {
    page?.setAttribute('data-view', 'sudoku');

    eachInput(sudokuInputs, input => {
      input.value = "";
      input.classList.remove('sudoku__value--style-light');
    })
  });

  on('#solve', 'click', () => {
    const problem: number[][] = [];

    eachInput(sudokuInputs, (input, rowIndex, colIndex) => {
      problem[rowIndex] = problem[rowIndex] || [];
      problem[rowIndex][colIndex] = +input.value;
    });
    const solution = solveSudoku(problem);

    eachInput(sudokuInputs, (input, rowIndex, colIndex) => {
      input.value = `${solution[rowIndex][colIndex]}`;

      if (problem[rowIndex][colIndex] === 0) {
        input.classList.add('sudoku__value--style-light');
      }
    });
  });
});
