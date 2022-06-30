import Tools from "./tools";
import avatar from "../images/avatar.jpg";

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

  lineWidth() {
    const { ctx, tools } = this;
    ctx.beginPath(); // 注意beginPath
    ctx.lineWidth = 5;
    ctx.moveTo(200, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.moveTo(200, 250);
    ctx.lineTo(300, 250);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.moveTo(200, 300);
    ctx.lineTo(300, 300);
    ctx.stroke();
  }

  strokeText() {
    const { ctx, tools } = this;
    ctx.font = "bold 30px 微软雅黑";
    ctx.strokeStyle = tools.getRandomColor();
    ctx.strokeText("Canvas", 100, 100);
  }
  fillText() {
    const { ctx, tools } = this;
    ctx.font = "bold 30px 微软雅黑";
    ctx.fillStyle = tools.getRandomColor();
    ctx.fillText("Canvas", 100, 200);
  }
  drawImage(callback?: Function) {
    const { ctx, tools } = this;
    let img = new Image();
    img.src = avatar;
    img.onload = () => {
      ctx.drawImage(img, 100, 100);
      callback && callback();
    };
  }
  // 图片平铺
  createPattern() {
    const { ctx, canvas } = this;
    let img = new Image();
    img.src = avatar;
    img.onload = () => {
      let pattern = ctx.createPattern(img, "repeat")!;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
  }
  // 裁剪
  clip() {
    const { ctx } = this;
    /**
    （1）绘制基本图形。
    （2）使用clip()方法。
    （3）绘制图片。
     */
    ctx.arc(150, 150, 50, 0, 360 * R);
    ctx.clip();
    this.drawImage();
  }
  clearRect() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  // 移动
  translate() {
    const { ctx } = this;
    this.fillRect();
    setInterval(() => {
      this.clearRect(); // 先清除画布
      ctx.translate(50, 0);
      this.fillRect();
    }, 1000);
  }

  scale() {
    const { ctx } = this;
    this.fillRect();
    ctx.scale(2, 2);
    this.drawImage();
  }

  rotate() {
    const { ctx } = this;
    let img = new Image();
    img.src = avatar;
    img.onload = () => {
      ctx.translate(100, 100);
      ctx.rotate(10 * R);
      ctx.drawImage(img, 0, 0);
    };
  }
}

export default Editor;
