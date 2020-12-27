
/**
 * Четырехсвязный список
 */
export class FourLinkedList {
  public readonly host: ListHead;

  public constructor(size: number) {
    const host = new ListHead();
    const cursor = new Array(size);

    let curr = host;

    for (let index = 0; index < size; index++) {
      const node = new ListHead();

      node.pL = curr;
      node.pR = host;
      curr.pR = node;
      curr = node;
      cursor[index] = node;
    }
    this.host = host;
    this.cursor = cursor;
  }

  public cursor: (ListHead | ListNode)[];

  private removeLR(node: ListNode | ListHead) {
    node.pL.pR = node.pR;
    node.pR.pL = node.pL;
  }

  private restoreLR(node: ListNode | ListHead) {
    node.pL.pR = node;
    node.pR.pL = node;
  }

  private removeTB(node: ListNode | ListHead) {
    node.pT.pB = node.pB;
    node.pB.pT = node.pT;

    if (node instanceof ListNode) {
      node.head.count--;
    }
  }

  private restoreTB(node: ListNode | ListHead) {
    node.pT.pB = node;
    node.pB.pT = node;

    if (node instanceof ListNode) {
      node.head.count++;
    }
  }

  private removeHead(head: ListHead) {
    this.removeLR(head);

    let row = head.pB;

    while (row !== head) {
      let col = row.pR;

      while (col !== row) {
        this.removeTB(col);

        col = col.pR;
      }
      row = row.pB;
    }
  }

  private restoreHead(head: ListHead) {
    this.restoreLR(head);

    let row = head.pB;

    while (row !== head) {
      let col = row.pR;

      while (col !== row) {
        this.restoreTB(col);

        col = col.pR;
      }
      row = row.pB;
    }
  }

  public remove(node: ListNode | ListHead) {
    if (node instanceof ListHead) {
      return this.removeHead(node);
    }
    this.removeHead(node.head);

    for(let cur = node.pR; cur !== node; cur = cur.pR) {
      this.removeHead(cur.head);
    }
  }

  public restore(node: ListNode | ListHead) {
    if (node instanceof ListHead) {
      return this.restoreHead(node);
    }

    for(let cur = node.pL; cur !== node; cur = cur.pL) {
      this.restoreHead(cur.head);
    }
    this.restoreHead(node.head);
  }

  public appendRow(rowIndex: number): ListRow {
    return new ListRow(this.cursor, rowIndex);
  }

  public static from(src: number[][]): FourLinkedList {
    const ROWS_COUNT = src?.length || 0;
    const COLS_COUNT = src[0]?.length || 0;
    const list = new FourLinkedList(COLS_COUNT);

    for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
      const row = list.appendRow(rowIndex);

      for (let colIndex = 0; colIndex < COLS_COUNT; colIndex++) {
        if (src[rowIndex][colIndex]) row.appendCol(colIndex);
      }
    }
    return list;
  }
}

export class ListNode {
  public head: ListHead;
  public pT: ListNode | ListHead;
  public pB: ListNode | ListHead;
  public pL: ListNode;
  public pR: ListNode;
  public index: number;
  public constructor (head: ListHead) {
    this.head = head;
    this.pT = this;
    this.pB = this;
    this.pL = this;
    this.pR = this;
    this.index = -1;
  }
}

export class ListHead {
  public count: number;
  public pT: ListHead | ListNode;
  public pB: ListHead | ListNode;
  public pL: ListHead;
  public pR: ListHead;
  public index: number;
  public constructor() {
    this.count = 0;
    this.pT = this;
    this.pB = this;
    this.pL = this;
    this.pR = this;
    this.index = -1;
  }
}

export class ListRow {
  public head: ListNode | null = null;
  public tail: ListNode | null = null;

  public constructor(
    private cursor: (ListHead | ListNode)[],
    private index: number,
  ) {}

  public appendCol(colIndex: number) {
    const cursor = this.cursor;
    const head = cursor[colIndex]?.pB;

    if (!head || head instanceof ListNode) return;

    const node = new ListNode(head);

    node.index = this.index;

    node.pT = cursor[colIndex];
    cursor[colIndex].pB = node;

    head.count++;
    head.pT = node;
    node.pB = head;

    this.head = this.head || node;
    this.tail = this.tail || node;
    node.pL = this.tail;
    node.pR = this.head;
    this.head.pL = node;
    this.tail.pR = node;

    cursor[colIndex] = node;
    this.tail = node;
  }
}
