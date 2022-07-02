import { Point } from "./types";
export default class Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
  }
  rect(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  checkBorder(point: Point) {
    const { x, y, w, h } = this;
    return point.x > x && point.x < x + w && point.y > y && point.y < y + h;
  }

  // 平移
  setTranslate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  stroke(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this;
    ctx.strokeRect(x, y, w, h);
  }

  fill(ctx: CanvasRenderingContext2D, fillStyle: string) {
    const { x, y, w, h } = this;
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x, y, w, h);
  }
}
