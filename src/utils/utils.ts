
export function loadImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load file ${file.name}`));
    image.src = URL.createObjectURL(file);
  });
}

export function eachInput(inputs: NodeListOf<HTMLInputElement> | null, handler: (input: HTMLInputElement, rowIndex: number, colIndex: number) => void) {
  const len = inputs?.length || 0;

  for (let index = 0; index < len; index++) {
    const input = inputs![index];
    const rowIndex = +(input.dataset.row || 0);
    const colIndex = +(input.dataset.col || 0);

    handler(input, rowIndex, colIndex);
  }
}

