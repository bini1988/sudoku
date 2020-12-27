import { FourLinkedList as List, ListHead } from "./four-linked-list";

function isEmpty(list: List) {
  return (
    (list.host?.pL === list.host) &&
    (list.host?.pR === list.host)
  );
}

function lowest(list: List): ListHead | null {
  let out: ListHead = list.host.pR;
  let cur: ListHead = out;

  while (cur !== list.host) {
    if (cur.count === 0) return null;
    if (cur.count < out.count) out = cur;
    cur = cur.pR;
  }
  return out;
}

function find(list: List, col: ListHead | null, out: number[]): boolean {
  if (col === null) return false;
  if (isEmpty(list)) return true;

  for(let row = col.pB; row !== col; row = row.pB) {
    list.remove(row);

    if (find(list, lowest(list), out)) {
      return !!out.push(row.index);
    }
    list.restore(row);
  }
  return false;
}

export function solve(src: number[][] | List) {
  const rows: number[] = [];
  const list = (src instanceof List) ? src : List.from(src);

  if (find(list, lowest(list), rows)) {
    return rows
  }
  return [];
}
