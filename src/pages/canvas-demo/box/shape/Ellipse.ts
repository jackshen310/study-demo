import { Point, Shape, EllipseData } from "./types";
export default class Ellipse<T extends EllipseData> implements Shape<T> {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.radiusX = 0;
    this.radiusY = 0;
  }

  setData(data: T) {
    this.x = data.x;
    this.y = data.y;
    this.radiusX = data.radiusX;
    this.radiusY = data.radiusY;
  }
  // 如果a>b，即焦点在x轴上，则满足(x*x/a/a+y*y/b/b < 1)的点在椭圆内，
  // 如果a<b，即焦点在y轴上，则满足(y*y/a/a+x*x/b/b<1)的点在椭圆内
  // https://www.cnblogs.com/xienb/p/10532087.html
  checkBorder(point: Point) {
    const { x: x0, y: y0, radiusX: a, radiusY: b } = this;
    let x = point.x - x0;
    let y = point.y - y0;
    if (a >= b) {
      return (
        Math.pow(x, 2) / Math.pow(a, 2) + Math.pow(y, 2) / Math.pow(b, 2) < 1
      );
    } else {
      return (
        Math.pow(y, 2) / Math.pow(a, 2) + Math.pow(x, 2) / Math.pow(b, 2) < 1
      );
    }
  }

  // 平移
  setTranslate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  stroke(ctx: CanvasRenderingContext2D) {
    const { x, y, radiusX, radiusY } = this;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, (360 * Math.PI) / 180);
    ctx.stroke();
  }

  fill(ctx: CanvasRenderingContext2D, fillStyle: string) {
    const { x, y, radiusX, radiusY } = this;
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, (360 * Math.PI) / 180);
    ctx.fill();
  }
}
