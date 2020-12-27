
/**
 * Четырехсвязный список
 */
export class FourLinkedList {
  public constructor(
    public host: ListHead
  ) {}

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

  public print() {
    let col = this.host.pR;
    const cols = [];

    while (col !== this.host) {
      cols.push(`[${col.count}]`)
      col = col.pR;
    }
    console.log(cols.join("-"))
  }

  public static from(src: number[][]): FourLinkedList {
    const ROWS_COUNT = src?.length || 0;
    const COLS_COUNT = src[0]?.length || 0;
    const cols = new Array<ListHead | ListNode>(COLS_COUNT);
    const host = new ListHead();

    let prevNode = host;

    for (let colIndex = 0; colIndex < COLS_COUNT; colIndex++) {
      const node = new ListHead();

      node.pL = prevNode;
      node.pR = host;
      prevNode.pR = node;
      prevNode = node;
      cols[colIndex] = node;
    }

    for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
      let pHead: ListNode | null = null;
      let pTail: ListNode | null = null;

      for (let colIndex = 0; colIndex < COLS_COUNT; colIndex++) {
        if (src[rowIndex][colIndex] === 0) continue;

        const nodeHead = cols[colIndex].pB as ListHead;
        const node = new ListNode(nodeHead);

        node.index = rowIndex;

        node.pT = cols[colIndex];
        cols[colIndex].pB = node;

        nodeHead.count++;
        nodeHead.pT = node;
        node.pB = nodeHead;

        pHead = pHead ? pHead : node;
        pTail = pTail ? pTail : node;
        node.pL = pTail;
        node.pR = pHead;
        pHead.pL = node;
        pTail.pR = node;

        cols[colIndex] = node;
        pTail = node;
      }
    }
    return new FourLinkedList(host);
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
