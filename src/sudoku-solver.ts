import { FourLinkedList as List, ListNode } from "./four-linked-list";
import { solve } from './x-algorithm';

export class SudokuSolver {
  public constructor(
    private list: List,
    private solution: ListNode[]
  ) {}

  public solve(): number[] {
    const out: number[] = [];

    for (const row of this.solution) {
      this.list.remove(row);
      out.push(row.index);
    }
    return out.concat(solve(this.list));
  }

  public static quad(rowIndex: number, colIndex: number): number {
    switch (rowIndex) {
      case 0:
      case 1: switch (colIndex) {
        case 0: return 0;
        case 1: return 0;
        default: return 1;
      }
      case 2:
      case 3: switch (colIndex) {
        case 0: return 2;
        case 1: return 2;
        default: return 3;
      }
      default: return 0;
    }
  }

  public static from(src: number[][]): SudokuSolver {
    const ROWS_COUNT = 4;
    const COLS_COUNT = 4;
    const NUMS_COUNT = 4;
    const QUADS_COUNT = 4;

    const ROWS_OFFSET = ROWS_COUNT * COLS_COUNT;
    const COLS_OFFSET = ROWS_OFFSET + ROWS_COUNT * NUMS_COUNT;
    const QUADS_OFFSET = COLS_OFFSET + COLS_COUNT * NUMS_COUNT;

    const list = new List(
      ROWS_COUNT * COLS_COUNT +
      ROWS_COUNT * NUMS_COUNT +
      COLS_COUNT * NUMS_COUNT +
      QUADS_COUNT * NUMS_COUNT
    );
    const rows: ListNode[] = [];

    for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
      const rowOffset = rowIndex * COLS_COUNT;

      for (let colIndex = 0; colIndex < COLS_COUNT; colIndex++) {
        const colOffset = colIndex * COLS_COUNT;
        const numValue = src[rowIndex][colIndex];
        const quadOffset =  SudokuSolver.quad(rowIndex, colIndex) * COLS_COUNT;

        for (let numIndex = 0; numIndex < NUMS_COUNT; numIndex++) {
          const row = list.appendRow(rowOffset * ROWS_COUNT + colOffset + numIndex)

          row.appendCol(rowOffset + colIndex);
          row.appendCol(rowOffset + numIndex + ROWS_OFFSET);
          row.appendCol(colOffset + numIndex + COLS_OFFSET);
          row.appendCol(quadOffset + numIndex + QUADS_OFFSET);

          if (numValue === numIndex + 1 && row.head) {
            rows.push(row.head);
          }
        }
      }
    }
    return new SudokuSolver(list, rows);
  }
}
