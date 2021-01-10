import { solveSudoku } from '../sudoku-solver';

const IMG_WIDTH = 720;
const IMG_HEIGHT = 720;
const OCRAD = window.OCRAD;

function arrangeApproxPoints(cv:any, approx: any) {
  const data = approx.data32S;

  let sumMin = 0;
  let sumMax = 0;
  let subMin = 0;
  let subMax = 0;

  for (let i = 0; i < data.length; i += 2) {
    const sum = data[i + 1] + data[i];

    if (sum > data[sumMax] + data[sumMax + 1]) {
      sumMax = i;
    } else if (sum < data[sumMin] + data[sumMin + 1]) {
      sumMin = i;
    }
  }
  for (let i = 0; i < data.length; i += 2) {
    const sub = data[i + 1] - data[i];

    if (i === sumMin || i === sumMax) {
      continue;
    } else if (sub > data[subMax + 1] - data[subMax]) {
      subMax = i;
    } else if (sub < data[subMin + 1] - data[subMin]) {
      subMin = i;
    }
  }

  return cv.matFromArray(4, 1, cv.CV_32FC2, [
    data[sumMin], data[sumMin + 1],
    data[subMin], data[subMin + 1],
    data[subMax], data[subMax + 1],
    data[sumMax], data[sumMax + 1],
  ]);
}

function findSudokuCountor(cv:any, src: any, dst: any = src, draw = false) {
  const MIN_CONTOUR_AREA = 8000;
  const contours  = new cv.MatVector();
  const hierarchy = new cv.Mat();

  let maxArea = 0;
  let maxIndex = 0;
  let maxApprox = null;

  cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  for (let index = 0; index < contours.size(); ++index) {
    const contour = contours.get(index);
    const area = Math.abs(cv.contourArea(contour));

    if (area > MIN_CONTOUR_AREA) {
      const perimeter = cv.arcLength(contour, true);
      const currApprox = new cv.Mat();

      cv.approxPolyDP(contour, currApprox, perimeter * 0.02, true);

      const { height: sides } = currApprox.size();
      const isConvex = cv.isContourConvex(currApprox);

      if (isConvex && (sides === 4) && (area > maxArea)) {
        maxApprox?.delete();

        maxIndex = index;
        maxArea = area;
        maxApprox = currApprox;
      } else {
        currApprox?.delete();
      }
    }
  }
  const approx = maxApprox ? arrangeApproxPoints(cv, maxApprox) : null;

  if (draw) {
    const color = new cv.Scalar(0, 255, 0, 0);
    const thickness = 2;

    cv.drawContours(dst, contours, maxIndex, color, thickness, cv.FILLED);
  }
  maxApprox?.delete();
  contours.delete();
  hierarchy.delete();

  return approx;
}

function predictCell(cv:any, cell: any, width = 28, height = 28) {
  cv.resize(cell, cell, { width, height });

  return new Promise<string>(resolve => {
    const data = new Uint8ClampedArray(cell.data);

    OCRAD(new ImageData(data, width, height), { numeric: true }, resolve);
  });
}

export async function captureSudoku(src: any, dst: any) {
  try {
    const cv = await window.cv;
    const ksize = new cv.Size(5, 5);

    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(dst, dst, ksize, 1);
    cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 19, 2);

    const dstApprox = findSudokuCountor(cv, dst);

    if (dstApprox) {
      const dstWarp = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, IMG_WIDTH, 0, 0, IMG_HEIGHT, IMG_WIDTH, IMG_HEIGHT]);
      const warpSize = { width: IMG_WIDTH, height: IMG_HEIGHT };
      const warpMatrix = cv.getPerspectiveTransform(dstApprox, dstWarp);

      cv.warpPerspective(src, dst, warpMatrix, warpSize);

      warpMatrix.delete();

      const problem: number[][] = [];
      const SUDOKU_SIZE = 9;
      const cellOffset = 10;
      const cellWidth = ~~(IMG_WIDTH / SUDOKU_SIZE);
      const cellHeight = ~~(IMG_HEIGHT / SUDOKU_SIZE);
      const promises = [];

      for (let rowIndex = 0; rowIndex < SUDOKU_SIZE; rowIndex++) {
        problem[rowIndex] = problem[rowIndex] || [];

        for (let colIndex = 0; colIndex < SUDOKU_SIZE; colIndex++) {
          const cell = dst.roi(new cv.Rect(
            colIndex * cellWidth + cellOffset,
            rowIndex * cellHeight + cellOffset,
            cellWidth - cellOffset * 2,
            cellHeight - cellOffset * 2,
          ));

          promises.push(
            predictCell(cv, cell).then(text => {
              problem[rowIndex][colIndex] = text ? parseInt(text, 10) : 0;
            })
          );
          cell.delete();
        }
      }

      await Promise.all(promises);

      const solution = solveSudoku(problem);
      const textColor = [255, 255, 255, 1];
      const blank = cv.Mat.zeros(IMG_HEIGHT, IMG_WIDTH, cv.CV_8UC4);
      const warpSrcSize = src.size();
      const warpSrcMatrix = cv.getPerspectiveTransform(dstWarp, dstApprox);

      for (let rowIndex = 0; rowIndex < SUDOKU_SIZE; rowIndex++) {
        for (let colIndex = 0; colIndex < SUDOKU_SIZE; colIndex++) {
          if (problem[rowIndex][colIndex] === 0) {
            const text = `${solution[rowIndex][colIndex]}`;
            const textX = colIndex * cellWidth + cellWidth * 0.2;
            const textY = rowIndex * cellHeight + cellHeight * 0.8;
            const pos = new cv.Point(textX, textY);

            cv.putText(blank, text, pos, cv.FONT_HERSHEY_PLAIN, 4, textColor, 2, cv.LINE_AA);
          }
        }
      }
      cv.warpPerspective(blank, blank, warpSrcMatrix, warpSrcSize);
      cv.threshold(blank, blank, 10, 255, cv.THRESH_BINARY);

      src.copyTo(dst);
      dst.setTo([147, 147, 147, 1], blank);

      warpSrcMatrix.delete();

      blank.delete();
      dstWarp.delete();
      dstApprox.delete();
    } else {
      src.copyTo(dst);
    }
  } catch (error) {
    console.error("Sudoku capture error", error);
  }
}

