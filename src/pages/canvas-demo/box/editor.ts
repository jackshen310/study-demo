import Tools from "../basic/tools";
import avatar from "../images/avatar.jpg";
import Circle from "./shape/Circle";
import Line from "./shape/Line";
import Rect from "./shape/Rect";
import Triangle from "./shape/Triangle";

const R = Math.PI / 180;

type Shape = {
  type: "rect" | "line" | "circle" | "triangle";
  prop: any;
};
class Editor {
  canvas: HTMLCanvasElement;
  canvasView: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ctxView: CanvasRenderingContext2D;
  tools: Tools;
  shapes: Shape[];

  constructor(canvas: HTMLCanvasElement, canvasView: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasView = canvasView;

    this.ctx = canvas.getContext("2d")!;
    this.ctxView = canvasView.getContext("2d")!;
    this.tools = new Tools();
    this.shapes = [];

    this.init();
  }

  init() {
    const { ctxView } = this;
  }

  clearRect() {
    const { ctxView, canvas } = this;
    ctxView.clearRect(0, 0, canvas.width, canvas.height);
  }

  save() {
    this.ctxView.save();
  }

  restore() {
    this.ctxView.restore();
  }

  getMouse() {
    const { canvasView, tools } = this;
    return tools.getMouse(canvasView);
  }
  // 画一条直线
  strokeLine(sx: number, sy: number, dx: number, dy: number) {
    const { ctxView } = this;

    ctxView.save();
    ctxView.beginPath();
    ctxView.moveTo(sx, sy);
    ctxView.lineTo(dx, dy);
    ctxView.stroke();
    ctxView.restore();
  }
  // 画线
  drawLine() {
    const { ctxView, canvasView } = this;
    let sx: number, sy: number, dx, dy;
    let mouse = this.getMouse();
    let shape: Line;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;
      shape.line(sx, sy, dx, dy);
      shape.stroke(ctxView);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push({
        type: "line",
        prop: shape,
      });
      this.drawShapes();

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      // 记住鼠标位置
      sx = mouse.x;
      sy = mouse.y;
      shape = new Line();

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }

  // 画矩形
  drawStrokeRect() {
    const { ctxView, canvasView } = this;
    let sx: number, sy: number, dx, dy;
    let mouse = this.getMouse();
    let shape: Rect;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      shape.rect(
        Math.min(sx, dx),
        Math.min(sy, dy),
        Math.abs(dx - sx),
        Math.abs(dy - sy)
      );
      shape.stroke(ctxView);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push({
        type: "rect",
        prop: shape,
      });
      this.drawShapes();

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      // 记住鼠标位置
      sx = mouse.x;
      sy = mouse.y;

      shape = new Rect();

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }

  // 画圆
  drawStrokeCircle() {
    const { ctx, ctxView, canvasView } = this;
    let sx: number, sy: number, dx, dy;
    let mouse = this.getMouse();
    let shape: Circle;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      // 计算夹角
      let angle = Math.atan2(dy - sy, dx - sx);

      // 计算半径
      let radius =
        Math.sqrt(
          Math.pow(Math.abs(dx - sx), 2) + Math.pow(Math.abs(dy - sy), 2)
        ) / 2;

      // 计算x，y轴
      let x = radius * Math.cos(angle) + sx;
      let y = radius * Math.sin(angle) + sy;

      shape.circle(x, y, radius);
      shape.stroke(ctxView);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push({
        type: "circle",
        prop: shape,
      });
      this.drawShapes();

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      // 记住鼠标位置
      sx = mouse.x;
      sy = mouse.y;
      shape = new Circle();

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }
  drawShapes() {
    const { shapes, ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
      const { type, prop } = shape;
      if (type === "rect") {
        prop.stroke(ctx);
      } else if (type === "circle") {
        prop.stroke(ctx);
      } else if (type === "line") {
        prop.stroke(ctx);
      } else if (type === "triangle") {
        prop.stroke(ctx, true);
      }
    });
  }

  dragShape() {
    const { ctxView, canvasView, shapes } = this;
    let curShape: Shape;
    let x1 = 0;
    let y1 = 0;
    let mouse = this.getMouse();

    const onMouseMove = () => {
      this.clearRect();

      const { type, prop } = curShape;
      if (type === "rect") {
        let d = mouse.x - x1;
        let f = mouse.y - y1;

        ctxView.save();
        ctxView.setTransform(1, 0, 0, 1, d, f);
        prop.fill(ctxView, "green");
        ctxView.restore();
      } else if (type === "circle") {
        let d = mouse.x - x1;
        let f = mouse.y - y1;

        ctxView.save();
        ctxView.setTransform(1, 0, 0, 1, d, f);
        prop.fill(ctxView, "green");
        ctxView.restore();
      } else if (type === "line") {
        let d = mouse.x - x1;
        let f = mouse.y - y1;

        ctxView.save();
        ctxView.setTransform(1, 0, 0, 1, d, f);
        prop.fill(ctxView, "green");
        ctxView.restore();
      } else if (type === "triangle") {
        let d = mouse.x - x1;
        let f = mouse.y - y1;
        ctxView.save();
        ctxView.setTransform(1, 0, 0, 1, d, f);
        prop.fill(ctxView, "green");
        ctxView.restore();
      }
    };

    const onMouseUp = () => {
      this.clearRect();
      // 将视图层copy到缓冲层
      curShape.prop.setTranslate(mouse.x - x1, mouse.y - y1);
      this.shapes.push(curShape);
      this.drawShapes();

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      // 记住鼠标位置
      let mouse = this.getMouse();

      let flag = false;
      for (let i = shapes.length - 1; i >= 0; i--) {
        let { type, prop } = shapes[i];
        if (type === "rect") {
          if (prop.checkBorder(mouse)) {
            curShape = shapes[i];
            shapes.splice(i, 1);
            flag = true;
            break;
          }
        } else if (type === "circle") {
          if (prop.checkBorder(mouse)) {
            curShape = shapes[i];
            shapes.splice(i, 1);
            flag = true;
            break;
          }
        } else if (type === "triangle") {
          if (prop.checkBorder(mouse)) {
            curShape = shapes[i];
            shapes.splice(i, 1);
            flag = true;
            break;
          }
        } else if (type === "line") {
          if (prop.checkBorder(mouse)) {
            curShape = shapes[i];
            shapes.splice(i, 1);
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        x1 = mouse.x;
        y1 = mouse.y;

        this.drawShapes();

        canvasView.addEventListener("mousemove", onMouseMove);
        canvasView.addEventListener("mouseup", onMouseUp);
      }
    };
  }

  // 画三角形
  drawStrokeTriangle() {
    const { ctx, canvasView } = this;
    let sx: number, sy: number, dx: number, dy: number;
    let mouse = this.getMouse();
    let isFirstPoint = true;
    let shape: Triangle;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      this.strokeLine(sx, sy, dx, dy);
    };

    const onMouseUp = () => {
      this.clearRect();

      shape.lineTo({ x: dx, y: dy });
      if (shape.isFinish()) {
        // 将视图层copy到缓冲层
        this.shapes.push({
          type: "triangle",
          prop: shape,
        });
        this.drawShapes();

        isFirstPoint = true;
      } else {
        shape.stroke(ctx);
        sx = dx;
        sy = dy;
      }

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      if (isFirstPoint) {
        // 记住鼠标位置
        sx = mouse.x;
        sy = mouse.y;

        // 第一个个点
        shape = new Triangle();
        shape.moveTo({ x: sx, y: sy });

        isFirstPoint = false;
      }

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }
}

export default Editor;
