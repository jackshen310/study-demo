import { Point, Shape } from "./types";
export default class Polygon<T extends Point> implements Shape<T> {
  points: Point[];
  constructor() {
    this.points = [];
  }

  setData(point: Point) {
    const { points } = this;

    points.push(point);
  }

  isFinish(point: Point) {
    const { points } = this;
    if (points.length < 3) {
      return false;
    }
    let first = points[0];

    let dx = point.x - first.x;
    let dy = point.y - first.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 6) {
      return true;
    } else {
      return false;
    }
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
    const { points } = this;

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        for (let k = 0; k < points.length && k !== i && k !== j; k++) {
          if (
            this.getCross(points[i], points[j], point) *
              this.getCross(points[i], points[j], points[k]) <
            0
          ) {
            return false;
          }
        }
      }
    }
    return true;
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
