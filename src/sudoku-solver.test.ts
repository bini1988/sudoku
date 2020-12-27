import { expect } from 'chai';
import { SudokuSolver } from './sudoku-solver';

describe('Решение Судоку', () => {
  it('Проблема #1', () => {
    const problem = [
      [0, 4, 0, 0],
      [0, 0, 0, 3],
      [2, 0, 0, 0],
      [0, 0, 1, 0],
    ];
    const solver = SudokuSolver.from(problem);
    const solution = solver.solve();

    expect(solution).to.have.all.members([
      2, 7, 9, 12, 16, 21, 27, 30, 33, 36, 42, 47, 51, 54, 56, 61
    ]);
  });
});
