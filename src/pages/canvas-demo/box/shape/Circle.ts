import { Point } from "./types";
export default class Circle {
  x: number;
  y: number;
  radius: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
  }
  circle(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  checkBorder(point: Point) {
    const { x, y, radius } = this;
    let dx = point.x - x;
    let dy = point.y - y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < radius) {
      return true;
    } else {
      return false;
    }
  }

  // 平移
  setTranslate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  stroke(ctx: CanvasRenderingContext2D) {
    const { x, y, radius } = this;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, (360 * Math.PI) / 180);
    ctx.stroke();
  }

  fill(ctx: CanvasRenderingContext2D, fillStyle: string) {
    const { x, y, radius } = this;
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.arc(x, y, radius, 0, (360 * Math.PI) / 180);
    ctx.fill();
  }
}
