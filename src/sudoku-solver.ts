import { FourLinkedList as List, ListNode } from "./four-linked-list";
import * as XAlgorithm from './x-algorithm';

export interface SudokuCell {
  numValue: number;
  rowIndex: number;
  colIndex: number;
}

export function quad(rowIndex: number, colIndex: number, size: number): number {
  const quads =  Math.sqrt(size);

  return ~~(rowIndex / quads) * quads + ~~(colIndex / quads);
}

export function zeros(size: number): number[][] {
  const out: number[][] = [];

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    out[rowIndex] = out[rowIndex] || [];

    for (let colIndex = 0; colIndex < size; colIndex++) {
      out[rowIndex][colIndex] = 0;
    }
  }
  return out;
}

export function pushCell(arr: number[][], cell?: SudokuCell) {
  if (cell) arr[cell.rowIndex][cell.colIndex] = cell.numValue;
}

export function solve(src: number[][]) {
  const RANK = src?.length || 0;
  const ROWS_COUNT = RANK;
  const COLS_COUNT = RANK;
  const NUMS_COUNT = RANK;

  const PAGE_1 = RANK * RANK;
  const PAGE_2 = PAGE_1 * 2;
  const PAGE_3 = PAGE_1 * 3;

  const list = new List<SudokuCell>(RANK * RANK * 4);
  const outRows: ListNode<SudokuCell>[] = [];
  const out = zeros(RANK);

  for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
    const rowsOffset = rowIndex * ROWS_COUNT;

    for (let colIndex = 0; colIndex < COLS_COUNT; colIndex++) {
      const colsOffset = colIndex * COLS_COUNT;
      const rowIndexOffset = rowsOffset * ROWS_COUNT + colsOffset;
      const numValue = src[rowIndex][colIndex] - 1;
      const quadOffset = quad(rowIndex, colIndex, RANK) * RANK;

      for (let numIndex = 0; numIndex < NUMS_COUNT; numIndex++) {
        const cell = { numValue: numIndex + 1, rowIndex, colIndex };
        const row = list
          .pushRow(rowIndexOffset + numIndex, cell)
          .pushCol(rowsOffset + colIndex)            // cells
          .pushCol(rowsOffset + numIndex + PAGE_1)   // rows
          .pushCol(colsOffset + numIndex + PAGE_2)   // cols
          .pushCol(quadOffset + numIndex + PAGE_3);  // quads

        if (row.ref && numIndex === numValue) {
          outRows.push(row.ref);
        }
      }
    }
  }

  for (const row of outRows) {
    list.remove(row);
  }
  outRows.push(...XAlgorithm.solve(list));

  for (const row of outRows) {
    pushCell(out, row.data);
  }
  return out;
}
