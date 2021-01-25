
/**
 * Четырехсвязный список
 */
export class FourLinkedList<T = unknown> {
  public readonly host: ListHead<T>;
  public readonly head: ListHead<T>[];

  public constructor(size: number) {
    const host = new ListHead<T>();
    const head = new Array<ListHead<T>>(size);

    let curr = host;

    for (let index = 0; index < size; index++) {
      const node = new ListHead<T>();

      node.pL = curr;
      node.pR = host;
      curr.pR = node;
      curr = node;
      head[index] = node;
    }
    this.host = host;
    this.head = head;
  }

  private removeLR(node: ListElement<T>) {
    node.pL.pR = node.pR;
    node.pR.pL = node.pL;
  }

  private restoreLR(node: ListElement<T>) {
    node.pL.pR = node;
    node.pR.pL = node;
  }

  private removeTB(node: ListElement<T>) {
    node.pT.pB = node.pB;
    node.pB.pT = node.pT;

    if (node instanceof ListNode) {
      node.pH.amount--;
    }
  }

  private restoreTB(node: ListElement<T>) {
    node.pT.pB = node;
    node.pB.pT = node;

    if (node instanceof ListNode) {
      node.pH.amount++;
    }
  }

  private removeHead(head: ListHead<T>) {
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

  private restoreHead(head: ListHead<T>) {
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

  public remove(node: ListElement<T>) {
    if (node instanceof ListHead) {
      return this.removeHead(node);
    }
    this.removeHead(node.pH);

    for(let cur = node.pR; cur !== node; cur = cur.pR) {
      this.removeHead(cur.pH);
    }
  }

  public restore(node: ListElement<T>) {
    if (node instanceof ListHead) {
      return this.restoreHead(node);
    }

    for(let cur = node.pL; cur !== node; cur = cur.pL) {
      this.restoreHead(cur.pH);
    }
    this.restoreHead(node.pH);
  }

  public pushRow(rowIndex: number, data?: T) {
    return new ListRow(rowIndex, this.head, data);
  }

  public static from<T>(src: number[][]): FourLinkedList<T> {
    const ROWS_COUNT = src?.length || 0;
    const COLS_COUNT = src[0]?.length || 0;
    const list = new FourLinkedList<T>(COLS_COUNT);

    for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
      const row = list.pushRow(rowIndex);

      for (let colIndex = 0; colIndex < COLS_COUNT; colIndex++) {
        if (src[rowIndex][colIndex]) row.pushCol(colIndex);
      }
    }
    return list;
  }
}

export type ListElement<T> = ListHead<T> | ListNode<T>;

/**
 * Позиция элемента в списке
 */
export class Position {
  /** Индекс строки */
  public row: number;
  /** Индекс колонки */
  public col: number;

  public constructor() {
    this.row = -1;
    this.col = -1;
  }
}

/**
 * Элемент списка
 */
export class ListNode<T = unknown> {
  /** Указатель на заголовок */
  public pH: ListHead<T>;
  /** Указатель на верхнего соседа */
  public pT: ListElement<T>;
  /** Указатель на нижнего соседа */
  public pB: ListElement<T>;
  /** Указатель на левого соседа */
  public pL: ListNode<T>;
  /** Указатель на правого соседа */
  public pR: ListNode<T>;
  /** Позиция элемента */
  public pos: Position;
  /** Связанные данные */
  public data?: T;

  public constructor (head: ListHead<T>) {
    this.pH = head;
    this.pT = this;
    this.pB = this;
    this.pL = this;
    this.pR = this;
    this.pos = new Position();
  }
}

/**
 * Элемент заголовка списка
 */
export class ListHead<T = unknown> {
  /** Указатель на верхнего соседа */
  public pT: ListElement<T>;
  /** Указатель на нижнего соседа */
  public pB: ListElement<T>;
  /** Указатель на левого соседа */
  public pL: ListHead<T>;
  /** Указатель на правого соседа */
  public pR: ListHead<T>;
  /** Число строк */
  public amount: number;

  public constructor() {
    this.pT = this;
    this.pB = this;
    this.pL = this;
    this.pR = this;
    this.amount = 0;
  }
}

/**
 * Список элементов строки списка
 */
export class ListRow<T = unknown> {
  public ref: ListNode<T> | null = null;

  public constructor(
    private readonly index: number,
    private readonly head: ListHead<T>[],
    private readonly data?: T,
  ) {}

  public pushCol(colIndex: number): ListRow<T> {
    const head = this.head;
    const rowIndex = this.index;;
    const colHead = head[colIndex];

    if (!colHead)  return this;

    const node = new ListNode<T>(colHead);
    const ref = this.ref || node;

    node.pos.row = rowIndex;
    node.pos.col = colIndex;
    node.data = this.data;

    node.pT = head[colIndex].pT;
    head[colIndex].pT.pB = node;

    colHead.amount++;
    colHead.pT = node;
    node.pB = colHead;

    node.pL = ref.pL;
    node.pR = ref;
    ref.pL.pR = node;
    ref.pL = node;

    this.ref = ref;

    return this;
  };
}
