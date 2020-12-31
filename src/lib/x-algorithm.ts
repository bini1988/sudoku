import { FourLinkedList as List, ListHead, ListNode } from "./four-linked-list";

function isEmpty<T>(list: List<T>) {
  return (
    (list.host?.pL === list.host) &&
    (list.host?.pR === list.host)
  );
}

function lowest<T>(list: List<T>): ListHead<T> | null {
  let out: ListHead<T> = list.host.pR;
  let cur: ListHead<T> = out;

  while (cur !== list.host) {
    if (cur.amount === 0) return null;
    if (cur.amount < out.amount) out = cur;
    cur = cur.pR;
  }
  return out;
}

function find<T>(list: List<T>, col: ListHead<T> | null, out: ListNode<T>[]): boolean {
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

export function solve<T>(src: number[][] | List<T>): ListNode<T>[] {
  const rows: ListNode<T>[] = [];
  const list: List<T> = (src instanceof List) ? src : List.from(src);

  if (find(list, lowest(list), rows)) {
    return rows;
  }
  return [];
}
