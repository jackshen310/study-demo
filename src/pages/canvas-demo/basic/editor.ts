import Tools from "./tools";
import avatar from "../images/avatar.jpg";
import Arrow from "./arrow";
import Ball from "./ball";

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

  init() {
    const { ctx } = this;
    window.addEventListener("keydown", (e) => {
      console.log(e);
      let step = 2;
      switch (e.key) {
        case "ArrowUp":
          ctx.translate(0, -step);
          break;
        case "ArrowDown":
          ctx.translate(0, step);
          break;
        case "ArrowLeft":
          ctx.translate(-step, 0);
          break;
        case "ArrowRight":
          ctx.translate(step, 0);
          break;
      }
    });
  }

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
  drawImage(callback?: (img: HTMLImageElement) => void) {
    const { ctx, tools } = this;
    let img = new Image();
    img.src = avatar;
    img.onload = () => {
      ctx.drawImage(img, 100, 100);
      callback && callback(img);
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

  setTransform() {
    const { ctx } = this;
    ctx.setTransform(1, 0, 0, 1, 50, 100); // 重复调用setTransform以最后一次为准
    this.fillRect();
  }
  // 反转效果
  getImageData() {
    const { ctx } = this;
    this.drawImage((img) => {
      let imgData = ctx.getImageData(100, 100, img.width, img.height);
      let data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      ctx.putImageData(imgData, 0, 0);
    });
  }
  // 灰度图
  averageImage() {
    const { ctx } = this;
    this.drawImage((img) => {
      let imgData = ctx.getImageData(100, 100, img.width, img.height);
      let data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      ctx.putImageData(imgData, 0, 0);
    });
  }
  // 渐变色
  createLinearGradient() {
    const { ctx } = this;
    let gnt = ctx.createLinearGradient(0, 50, 100, 50);
    gnt.addColorStop(0, "green");
    gnt.addColorStop(1, "red");
    ctx.fillStyle = gnt;

    ctx.fillRect(0, 0, 100, 100);
  }
  // 画一个三角形
  beginPath() {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(100, 200);
    ctx.lineTo(200, 200);
    ctx.closePath(); // 相当于 ctx.lineTo(100,100);
    ctx.stroke();
  }
  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }
  // 阴影效果
  shadow() {
    const { ctx, tools } = this;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowColor = tools.getRandomColor();
    // ctx.shadowBlur = 10;
    this.fillRect();
  }

  getMouse() {
    const { canvas, tools } = this;
    return tools.getMouse(canvas);
  }

  drawArrow() {
    const { ctx, tools, canvas } = this;

    const mouse = this.getMouse();
    let arrow = new Arrow(
      canvas.width / 2,
      canvas.height / 2,
      tools.getRandomColor(),
      0
    );
    arrow.stroke(ctx);
    window.setInterval(() => {
      this.clearRect();
      let x = mouse.x - canvas.width / 2;
      let y = mouse.y - canvas.height / 2;
      arrow.angle = Math.atan2(y, x);
      arrow.stroke(ctx);
    }, 50);
  }

  drawBall() {
    const { ctx, tools, canvas } = this;

    let ball = new Ball(100, 25, 20, tools.getRandomColor());
    let angle = 0;
    let radius = 100; // 圆的半径
    window.setInterval(() => {
      this.clearRect();

      // 绘制圆形
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 360 * R);
      ctx.closePath();
      ctx.stroke();

      // 修改小球坐标
      ball.x = canvas.width / 2 + Math.cos(angle) * radius;
      ball.y = canvas.height / 2 + Math.sin(angle) * radius;
      ball.fill(ctx);

      angle += 0.05;
    }, 500);
  }
}

export default Editor;
