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
    ctx.save();
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
    ctx.restore();
  }
}
