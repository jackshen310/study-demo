﻿import { Mouse, Rect } from "./tools";

class Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  scaleX: number;
  scaleY: number;
  vx: number;
  vy: number;
  constructor(x: number, y: number, radius: number, color: string) {
    //小球中心的x坐标，默认值为0
    this.x = x || 0;
    //小球中心的y坐标，默认值为0
    this.y = y || 0;
    //小球半径，默认值为12
    this.radius = radius || 12;
    //小球颜色，默认值为“#6699FF”
    this.color = color || "#6699FF";
    //缩放倍数
    this.scaleX = 1;
    this.scaleY = 1;
    //x和y速度
    this.vx = 0;
    this.vy = 0;
  }
  //绘制“描边”小球
  stroke(cxt: CanvasRenderingContext2D) {
    cxt.save();
    cxt.scale(this.scaleX, this.scaleY);
    cxt.strokeStyle = this.color;
    cxt.beginPath();
    cxt.arc(this.x, this.y, this.radius, 0, (360 * Math.PI) / 180, false);
    cxt.closePath();
    cxt.stroke();
    cxt.restore();
  }
  //绘制“填充”小球
  fill(cxt: CanvasRenderingContext2D) {
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.scale(this.scaleX, this.scaleY);
    cxt.fillStyle = this.color;
    cxt.beginPath();
    cxt.arc(0, 0, this.radius, 0, (360 * Math.PI) / 180, false);
    cxt.closePath();
    cxt.fill();
    cxt.restore();
  }
  //获取包含小球的最小矩形
  getRect(): Rect {
    const rect = {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    };
    return rect;
  }
  checkMouse(mouse: Mouse) {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius) {
      return true;
    } else {
      return false;
    }
  }
}
export default Ball;
