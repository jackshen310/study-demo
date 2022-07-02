import { Point } from "./types";
export default class Triangle {
  points: Point[];
  constructor() {
    this.points = [];
  }
  moveTo(point: Point) {
    const { points } = this;

    points.length = 0;
    points.push(point);
  }

  lineTo(point: Point) {
    const { points } = this;

    points.push(point);
  }

  isFinish() {
    return this.points.length === 3;
  }
  // 向量叉乘 https://www.cnblogs.com/tuyang1129/p/9390376.html
  /**
   * 
   *点P在三角形ABC内部，可以通过以下三个条件判断：
    点P和点C在直线AB同侧
    点P和点B在直线AC同侧
    点P和点A在直线BC同侧

    向量a（x1，y1），向量b（x2，y2）
    a * b = x1*y2 - y1*x2
   */
  checkBorder(point: Point) {
    let a = this.points[0];
    let b = this.points[1];
    let c = this.points[2];

    if (
      this.getCross(a, b, point) * this.getCross(a, b, c) > 0 &&
      this.getCross(a, c, point) * this.getCross(a, c, b) > 0 &&
      this.getCross(b, c, point) * this.getCross(b, c, a) > 0
    ) {
      return true;
    }
    return false;
  }

  getCross(a: Point, b: Point, p: Point) {
    let x1 = b.x - a.x;
    let y1 = b.y - a.y;
    let x2 = p.x - a.x;
    let y2 = p.y - a.y;

    return x1 * y2 - y1 * x2;
  }
  // 平移
  setTranslate(x: number, y: number) {
    this.points.forEach((point) => {
      point.x = point.x + x;
      point.y = point.y + y;
    });
  }

  stroke(ctx: CanvasRenderingContext2D, closePath?: boolean) {
    ctx.save();
    ctx.beginPath();
    this.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    closePath && ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  fill(ctx: CanvasRenderingContext2D, fillStyle: string) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    this.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.fill();
  }
}
