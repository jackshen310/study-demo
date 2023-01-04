import Tools from "./tools";
import avatar from "../images/avatar.jpg";
import circle from "../images/circle.png";
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
  // 边界检测
  checkBorder() {
    const { ctx, tools, canvas } = this;
    let radius = 20;
    let ball = new Ball(100, 25, radius, tools.getRandomColor());
    ball.fill(ctx);

    // 边界检查
    const check = (ball: Ball) => {
      if (ball.y - radius < 0) {
        ball.y = radius;
      }
      if (ball.y + radius > canvas.height) {
        ball.y = canvas.height - radius;
      }
      if (ball.x - radius < 0) {
        ball.x = radius;
      }
      if (ball.x + radius > canvas.width) {
        ball.x = canvas.width - radius;
      }
    };
    window.addEventListener("keydown", (e) => {
      let step = 10;
      this.clearRect();
      switch (e.key) {
        case "ArrowUp":
          ball.y -= step;
          check(ball);
          ball.fill(ctx);
          break;
        case "ArrowDown":
          ball.y += step;
          check(ball);
          ball.fill(ctx);
          break;
        case "ArrowLeft":
          ball.x -= step;
          check(ball);
          ball.fill(ctx);
          break;
        case "ArrowRight":
          ball.x += step;
          check(ball);
          ball.fill(ctx);
          break;
        default:
          check(ball);
          ball.fill(ctx);
      }
    });
  }

  // 边界反弹
  checkBorder2() {
    const { ctx, tools, canvas } = this;
    let radius = 20;
    let ball = new Ball(100, 25, radius, tools.getRandomColor());
    ball.fill(ctx);

    let vx = (Math.random() * 2 - 1) * 3;
    let vy = (Math.random() * 2 - 1) * 3;
    // 边界检查
    const check = (ball: Ball) => {
      if (ball.y - radius < 0) {
        ball.y = radius;
        vy = -vy;
      }
      if (ball.y + radius > canvas.height) {
        ball.y = canvas.height - radius;
        vy = -vy;
      }
      if (ball.x - radius < 0) {
        ball.x = radius;
        vx = -vx;
      }
      if (ball.x + radius > canvas.width) {
        ball.x = canvas.width - radius;
        vx = -vx;
      }
    };
    setInterval(() => {
      this.clearRect();

      ball.x += vx;
      ball.y += vy;

      check(ball);

      ball.fill(ctx);
    }, 50);
  }
  // 碰撞检查
  checkRect() {
    const { ctx, tools, canvas } = this;
    let radius = 20;
    let ball = new Ball(
      canvas.width / 2,
      canvas.height / 2,
      radius,
      tools.getRandomColor()
    );
    ball.fill(ctx);

    let rectA = ball.getRect();

    setInterval(() => {
      this.clearRect();

      ball.fill(ctx);

      let mouse = this.getMouse();
      let ball2 = new Ball(mouse.x, mouse.y, radius, "blue");
      ball2.fill(ctx);

      let rectB = ball2.getRect();

      if (tools.checkRect(rectA, rectB)) {
        console.log("碰上了");
      } else {
        console.log("没碰上");
      }
    }, 50);
  }

  // 碰撞检查
  checkCircle() {
    const { ctx, tools, canvas } = this;
    let radius = 20;
    let ball = new Ball(
      radius,
      canvas.height / 2,
      radius,
      tools.getRandomColor()
    );

    let ball2 = new Ball(
      canvas.width - radius,
      canvas.height / 2,
      radius,
      tools.getRandomColor()
    );
    let vx = 5;
    setInterval(() => {
      this.clearRect();

      ball.fill(ctx);
      ball2.fill(ctx);

      ball.x += vx;
      ball2.x -= vx;

      if (ball.x < radius) {
        ball.x = radius;
        vx = -vx;
      }
      if (ball2.x > canvas.width - radius) {
        ball2.x = canvas.width - radius;
        // vx = -vx;
      }
      if (tools.checkCircle(ball, ball2)) {
        console.log("碰上了");
        vx = -vx;
      } else {
        console.log("没碰上");
      }
    }, 50);
  }

  // 矩形捕获
  captureRect() {
    const { ctx, tools, canvas } = this;

    let x = 100;
    let y = 100;
    let width = 200;
    let height = 100;
    ctx.fillStyle = tools.getRandomColor();
    ctx.rect(x, y, width, height);
    ctx.stroke();

    canvas.addEventListener("mousemove", () => {
      this.clearRect();

      let mouse = this.getMouse();
      if (
        mouse.x > x &&
        mouse.y > y &&
        mouse.x < x + width &&
        mouse.y < y + height
      ) {
        ctx.fillRect(x, y, width, height);
      } else {
        ctx.strokeRect(x, y, width, height);
      }
    });
  }

  // 拖拽矩形
  dragRect() {
    const { ctx, tools, canvas } = this;

    let x = 100;
    let y = 100;
    let width = 200;
    let height = 100;
    ctx.fillStyle = tools.getRandomColor();
    ctx.rect(x, y, width, height);
    ctx.stroke();

    let x1 = 0;
    let y1 = 0;

    const onMouseMove = () => {
      this.clearRect();

      let mouse = this.getMouse();
      x = mouse.x - x1;
      y = mouse.y - y1;
      ctx.fillRect(x, y, width, height);
    };
    const onMouseUp = () => {
      this.clearRect();
      ctx.strokeRect(x, y, width, height);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
    canvas.addEventListener("mousedown", () => {
      let mouse = this.getMouse();
      x1 = mouse.x - x;
      y1 = mouse.y - y;

      // 鼠标在矩形内才允许拖拽
      if (
        mouse.x > x &&
        mouse.y > y &&
        mouse.x < x + width &&
        mouse.y < y + height
      ) {
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", onMouseUp);
      }
    });
  }

  // 手动画一条线
  drawLineA() {
    const { ctx, canvas } = this;
    let sx: number, sy: number, dx, dy;

    const onMouseMove = () => {
      this.clearRect();
      ctx.save();
      let mouse = this.getMouse();
      dx = mouse.x;
      dy = mouse.y;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(dx, dy);
      ctx.stroke();
      ctx.restore();
    };
    const onMouseUp = () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };

    canvas.addEventListener("mousedown", () => {
      let mouse = this.getMouse();
      sx = mouse.x;
      sy = mouse.y;
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
    });
  }

  // 三点画一个圆
  drawCircle() {
    const { ctx, canvas, tools } = this;

    let img = new Image();
    img.src = circle;
    img.onload = () => {
      ctx.save();
      ctx.scale(0.5, 0.5);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };

    let points: Array<number> = [];
    let x = 0;
    let y = 0;
    let radian = 0;
    let radian2 = 0;
    let counterclockwise = false;
    canvas.addEventListener("mousedown", () => {
      let mouse = this.getMouse();

      points.push(mouse.x, mouse.y);

      ctx.save();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, 360 * R);
      ctx.closePath();
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.restore();

      if (points.length === 6) {
        // https://blog.csdn.net/qq_45874328/article/details/114934147
        let x1 = points[0];
        let y1 = points[1];
        let x2 = points[2];
        let y2 = points[3];
        let x3 = points[4];
        let y3 = points[5];

        let a = x1 - x2;
        let b = y1 - y2;
        let c = x1 - x3;
        let d = y1 - y3;
        let e = (x1 * x1 - x2 * x2 - (y2 * y2 - y1 * y1)) / 2.0;
        let f = (x1 * x1 - x3 * x3 - (y3 * y3 - y1 * y1)) / 2.0;

        x = (e * d - b * f) / (a * d - b * c);
        y = (a * f - e * c) / (a * d - b * c);

        let r = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));

        // 计算角度
        radian = Math.atan2(y1 - y, x1 - x);
        radian2 = Math.atan2(y3 - y, x3 - x);

        counterclockwise = false;
        if (
          Math.abs((radian * 180) / Math.PI) +
            Math.abs((radian2 * 180) / Math.PI) >
          180
        ) {
          counterclockwise = true;
        }

        ctx.save();
        ctx.lineWidth = 3;
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, r, radian, radian2, counterclockwise);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.restore();
      } else if (points.length === 8) {
        let r2 = Math.sqrt(
          (points[6] - x) * (points[6] - x) + (points[7] - y) * (points[7] - y)
        );
        ctx.save();
        ctx.lineWidth = 3;
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, r2, radian, radian2, counterclockwise);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.restore();

        points.length = 0;
      }
    });
  }
}

export default Editor;
