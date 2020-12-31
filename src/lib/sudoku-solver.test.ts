import { expect } from 'chai';
import { numberQuads } from './utils';
import { solve, quad } from './sudoku-solver';

describe('Решение Судоку', () => {
  it('Возвращает # квадрата по индексу клетки для 4x4', () => {
    const SIZE = 4;
    const quads = numberQuads(SIZE);

    for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
      for (let colIndex = 0; colIndex < SIZE; colIndex++) {
        expect(quad(rowIndex, colIndex, SIZE)).to.eq(quads[rowIndex][colIndex]);
      }
    }
  });
  it('Возвращает # квадрата по индексу клетки для 9x9', () => {
    const SIZE = 9;
    const quads = numberQuads(SIZE);

    for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
      for (let colIndex = 0; colIndex < SIZE; colIndex++) {
        expect(quad(rowIndex, colIndex, SIZE)).to.eq(quads[rowIndex][colIndex]);
      }
    }
  });
  it('Решение судоку 4x4', () => {
    const problem = [
      [0, 4, 0, 0],
      [0, 0, 0, 3],
      [2, 0, 0, 0],
      [0, 0, 1, 0],
    ];
    const sudoku = [
      [3, 4, 2, 1],
      [1, 2, 4, 3],
      [2, 1, 3, 4],
      [4, 3, 1, 2],
    ];
    const solution = solve(problem);

    for (let rowIndex = 0; rowIndex < problem.length; rowIndex++) {
      expect(solution[rowIndex]).to.have.all.members(sudoku[rowIndex]);
    }
  });
  it('Решение судоку 4x4 (hard)', () => {
    const problem = [
      [0, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
    ];
    const sudoku = [
      [3, 4, 2, 1],
      [1, 2, 4, 3],
      [2, 1, 3, 4],
      [4, 3, 1, 2],
    ];
    const solution = solve(problem);

    for (let rowIndex = 0; rowIndex < problem.length; rowIndex++) {
      expect(solution[rowIndex]).to.have.all.members(sudoku[rowIndex]);
    }
  });
  it('Решение судоку 9x9 (easy)', () => {
    const problem = [
      [0, 4, 3, 2, 0, 0, 0, 1, 0],
      [6, 0, 0, 0, 0, 0, 0, 2, 0],
      [9, 0, 0, 1, 0, 8, 0, 3, 0],
      [1, 0, 0, 0, 0, 0, 2, 0, 8],
      [0, 0, 0, 0, 2, 6, 0, 0, 0],
      [2, 0, 0, 8, 0, 4, 5, 0, 3],
      [4, 0, 8, 0, 0, 0, 0, 0, 0],
      [3, 0, 1, 9, 0, 0, 0, 0, 7],
      [0, 0, 0, 0, 4, 7, 0, 8, 0],
    ];
    const sudoku = [
      [8, 4, 3, 2, 7, 5, 9, 1, 6],
      [6, 1, 7, 4, 9, 3, 8, 2, 5],
      [9, 5, 2, 1, 6, 8, 7, 3, 4],
      [1, 3, 4, 7, 5, 9, 2, 6, 8],
      [7, 8, 5, 3, 2, 6, 1, 4, 9],
      [2, 9, 6, 8, 1, 4, 5, 7, 3],
      [4, 7, 8, 5, 3, 1, 6, 9, 2],
      [3, 6, 1, 9, 8, 2, 4, 5, 7],
      [5, 2, 9, 6, 4, 7, 3, 8, 1],
    ];
    const solution = solve(problem);

    for (let rowIndex = 0; rowIndex < problem.length; rowIndex++) {
      expect(solution[rowIndex]).to.have.all.members(sudoku[rowIndex]);
    };
  });
  it('Решение судоку 9x9 (middle)', () => {
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
    const sudoku = [
      [8, 9, 5, 1, 3, 7, 6, 2, 4],
      [6, 1, 2, 9, 4, 8, 3, 5, 7],
      [3, 4, 7, 5, 2, 6, 8, 9, 1],
      [4, 2, 6, 3, 8, 9, 1, 7, 5],
      [5, 3, 9, 4, 7, 1, 2, 8, 6],
      [7, 8, 1, 6, 5, 2, 9, 4, 3],
      [9, 5, 3, 8, 1, 4, 7, 6, 2],
      [2, 6, 4, 7, 9, 3, 5, 1, 8],
      [1, 7, 8, 2, 6, 5, 4, 3, 9],
    ];
    const solution = solve(problem);

    for (let rowIndex = 0; rowIndex < problem.length; rowIndex++) {
      expect(solution[rowIndex]).to.have.all.members(sudoku[rowIndex]);
    };
  });
  it('Решение судоку 9x9 (hard)', () => {
    const problem = [
      [5, 3, 0, 0, 0, 0, 0, 7, 0],
      [0, 6, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 8, 0, 6, 7, 0, 0, 5],
      [0, 0, 0, 6, 0, 8, 7, 2, 0],
      [0, 2, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 9, 0],
      [0, 0, 4, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 5, 8, 6, 0, 0, 0],
      [0, 0, 5, 0, 3, 0, 0, 0, 0],
    ];
    const sudoku = [
      [5, 3, 9, 8, 1, 2, 6, 7, 4],
      [1, 6, 7, 4, 5, 3, 2, 8, 9],
      [2, 4, 8, 9, 6, 7, 1, 3, 5],
      [4, 5, 3, 6, 9, 8, 7, 2, 1],
      [9, 2, 6, 3, 7, 1, 4, 5, 8],
      [8, 7, 1, 2, 4, 5, 3, 9, 6],
      [6, 8, 4, 7, 2, 9, 5, 1, 3],
      [3, 1, 2, 5, 8, 6, 9, 4, 7],
      [7, 9, 5, 1, 3, 4, 8, 6, 2],
    ];
    const solution = solve(problem);

    for (let rowIndex = 0; rowIndex < problem.length; rowIndex++) {
      expect(solution[rowIndex]).to.have.all.members(sudoku[rowIndex]);
    };
  });
});
