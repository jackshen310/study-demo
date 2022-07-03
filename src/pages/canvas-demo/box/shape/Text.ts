import { Point, Shape, TextData } from "./types";
export default class Text<T extends TextData> implements Shape<T> {
  x: number;
  y: number;
  text: string;
  tm: TextMetrics | null;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.text = "";
    this.tm = null;
  }

  setData(data: T) {
    this.x = data.x;
    this.y = data.y;
    this.text = data.text;
  }

  checkBorder(point: Point) {
    const { x, y, tm } = this;
    let w = tm?.width!;
    let h = tm?.fontBoundingBoxAscent!;
    return (
      point.x > x && point.x < x + w && point.y > y - h && point.y < y - h + h
    );
  }

  // 平移
  setTranslate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  stroke(ctx: CanvasRenderingContext2D) {
    const { x, y, text } = this;
    ctx.font = "bold 30px 微软雅黑";
    ctx.strokeText(text, x, y);
    this.tm = ctx.measureText(text);
  }

  fill(ctx: CanvasRenderingContext2D, fillStyle: string) {
    this.stroke(ctx);
  }
}
