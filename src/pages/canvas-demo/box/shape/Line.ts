import { Point, LineData, Shape } from "./types";
export default class Line<T extends LineData> implements Shape<T> {
  x: number;
  y: number;
  x2: number;
  y2: number;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.x2 = 0;
    this.y2 = 0;
  }
  setData(data: LineData) {
    this.x = data.x;
    this.y = data.y;
    this.x2 = data.x2;
    this.y2 = data.y2;
  }

  // TODO 这个以后再说
  checkBorder(point: Point) {
    const { x, y, x2, y2 } = this;

    let dx = x2 - x;
    let dy = y2 - y;
    let sx = point.x - x;
    let sy = point.y - y;
    // 计算夹角
    let angle = Math.atan2(dy - sy, dx - sx);

    // 计算距离
    let d = Math.sqrt(
      Math.pow(Math.abs(sx - dx), 2) + Math.pow(Math.abs(sy - dy), 2)
    );

    return Math.abs(d * Math.cos(angle)) <= 3;
  }

  // 平移
  setTranslate(x: number, y: number) {
    this.x += x;
    this.y += y;
    this.x2 += x;
    this.y2 += y;
  }

  stroke(ctx: CanvasRenderingContext2D) {
    const { x, y, x2, y2 } = this;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  fill(ctx: CanvasRenderingContext2D, fillStyle: string) {
    const { x, y, x2, y2 } = this;
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
}
