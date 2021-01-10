import { FourLinkedList, ListHead, ListNode } from './four-linked-list';

function isEmpty<T>(list: FourLinkedList<T>) {
  return (
    (list.host?.pL === list.host) &&
    (list.host?.pR === list.host)
  );
}

function lowest<T>(list: FourLinkedList<T>): ListHead<T> | null {
  let out: ListHead<T> = list.host.pR;
  let cur: ListHead<T> = out;

  while (cur !== list.host) {
    if (cur.amount === 0) return null;
    if (cur.amount < out.amount) out = cur;
    cur = cur.pR;
  }
  return out;
}

function find<T>(list: FourLinkedList<T>, col: ListHead<T> | null, out: ListNode<T>[]): boolean {
  if (col === null) return false;
  if (isEmpty(list)) return true;

  for(let row = col.pB; row !== col; row = row.pB) {
    if (row instanceof ListHead) continue;

    list.remove(row);

    if (find(list, lowest(list), out)) {
      return !!out.push(row);
    }
    list.restore(row);
  }
  return false;
}

export function solve<T>(src: number[][] | FourLinkedList<T>): ListNode<T>[] {
  const rows: ListNode<T>[] = [];
  const list: FourLinkedList<T> =
    (src instanceof FourLinkedList) ? src : FourLinkedList.from(src);

  if (find(list, lowest(list), rows)) {
    return rows;
  }
  return [];
}
