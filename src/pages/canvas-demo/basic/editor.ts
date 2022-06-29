import { text } from "stream/consumers";
import Tools from "./tools";

const R = Math.PI / 180;
class Editor {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tools: Tools;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.tools = new Tools();

    this.init();
  }

  init() {}

  drawLine() {
    const { ctx } = this;
    ctx.moveTo(10, 10);
    ctx.lineTo(100, 100);
    ctx.stroke();
  }

  strokeRect() {
    const { ctx } = this;
    ctx.strokeStyle = "green";
    ctx.strokeRect(100, 100, 50, 50);
  }

  fillRect() {
    const { ctx } = this;
    ctx.fillStyle = "green";
    ctx.fillRect(200, 100, 50, 50);
  }
  // 调色板
  colorPalette() {
    const { ctx } = this;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        ctx.fillStyle =
          "rgb(" +
          Math.floor(255 - 42.5 * i) +
          "," +
          Math.floor(255 - 42.5 * j) +
          ",0)";
        ctx.fillRect(j * 25, i * 25, 25, 25);
      }
    }
  }

  // 画圆
  arc() {
    const { ctx, tools } = this;
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, 360 * R);
    ctx.closePath();
    ctx.strokeStyle = tools.getRandomColor();
    ctx.stroke();
  }

  // 画弧线
  arcTo() {
    const { ctx, tools } = this;
    ctx.moveTo(100, 100);
    ctx.arcTo(120, 80, 150, 120, 50);
    ctx.strokeStyle = tools.getRandomColor();
    ctx.stroke();
  }
  createRounderRect() {
    const { ctx, tools } = this;
    tools.createRounderRect(ctx, 100, 50, 5, 100, 100);
  }
}

export default Editor;
