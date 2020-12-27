import { FourLinkedList as List, ListHead, ListNode } from "./four-linked-list";
import { solve } from './x-algorithm';

class ListRow {
  public pHead: ListNode | null = null;
  public pTail: ListNode | null = null;
  public constructor(
    private cols: (ListHead | ListNode)[],
    private index: number,
  ) {}
  public appendAt(colIndex: number) {
    const cols = this.cols;
    const nodeHead = cols[colIndex].pB as ListHead;
    const node = new ListNode(nodeHead);

    node.index = this.index;

    node.pT = cols[colIndex];
    cols[colIndex].pB = node;

    nodeHead.count++;
    nodeHead.pT = node;
    node.pB = nodeHead;

    this.pHead = this.pHead ? this.pHead : node;
    this.pTail = this.pTail ? this.pTail : node;
    node.pL = this.pTail;
    node.pR = this.pHead;
    this.pHead.pL = node;
    this.pTail.pR = node;

    cols[colIndex] = node;
    this.pTail = node;
  }
}

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

    const host = new ListHead();
    const cols = new Array<ListHead | ListNode>(
      ROWS_COUNT * COLS_COUNT +
      ROWS_COUNT * NUMS_COUNT +
      COLS_COUNT * NUMS_COUNT +
      QUADS_COUNT * NUMS_COUNT
    );

    let prevNode = host;

    for (let colIndex = 0; colIndex < cols.length; colIndex++) {
      const node = new ListHead();

      node.pL = prevNode;
      node.pR = host;
      prevNode.pR = node;
      prevNode = node;
      cols[colIndex] = node;
    }

    const rows: ListNode[] = [];

    for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
      const rowOffset = rowIndex * COLS_COUNT;

      for (let colIndex = 0; colIndex < COLS_COUNT; colIndex++) {
        const numValue = src[rowIndex][colIndex];
        const colOffset = colIndex * COLS_COUNT;
        const quadOffset =  SudokuSolver.quad(rowIndex, colIndex) * COLS_COUNT;

        for (let numIndex = 0; numIndex < NUMS_COUNT; numIndex++) {
          const index = rowOffset * ROWS_COUNT + colOffset + numIndex;
          const row = new ListRow(cols, index);

          row.appendAt(rowOffset + colIndex);
          row.appendAt(rowOffset + numIndex + ROWS_OFFSET);
          row.appendAt(colOffset + numIndex + COLS_OFFSET);
          row.appendAt(quadOffset + numIndex + QUADS_OFFSET);

          if (numValue === numIndex + 1 && row.pHead) {
            rows.push(row.pHead);
          }
        }
      }
    }
    return new SudokuSolver(new List(host), rows);
  }
}
