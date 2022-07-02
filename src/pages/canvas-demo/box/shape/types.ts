export type Point = {
  x: number;
  y: number;
};

export type CircleData = {
  x: number;
  y: number;
  radius: number;
};

export type LineData = {
  x: number;
  y: number;
  x2: number;
  y2: number;
};

export type RectData = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ShapeData = CircleData | LineData | Point | RectData;
export interface Shape<T> {
  setData: (data: T) => void;
  checkBorder: (point: Point) => boolean;
  setTranslate: (x: number, y: number) => void;
  stroke: (ctx: CanvasRenderingContext2D, closePath?: boolean) => void;
  fill: (ctx: CanvasRenderingContext2D, fillStyle: string) => void;
}
