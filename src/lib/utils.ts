
export function numberQuads(size: number): number[][] {
  const out: number[][] = [];
  const SIDE = Math.sqrt(size);

  for (let rowQuad = 0; rowQuad < SIDE; rowQuad++) {
    for (let colQuad = 0; colQuad < SIDE; colQuad++) {
      for (let rowIndex = 0; rowIndex < SIDE; rowIndex++) {
        for (let colIndex = 0; colIndex < SIDE; colIndex++) {
          const row = rowQuad * SIDE + rowIndex;
          const col = colQuad * SIDE + colIndex;

          out[row] = out[row] || [];
          out[row][col] = rowQuad * SIDE + colQuad;
        }
      }
    }
  }
  return out;
}
