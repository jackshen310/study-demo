import Tools from "../basic/tools";
import avatar from "../images/avatar.jpg";
import Circle from "./shape/Circle";
import Ellipse from "./shape/Ellipse";
import Line from "./shape/Line";
import Polygon from "./shape/Polygon";
import Rect from "./shape/Rect";
import Triangle from "./shape/Triangle";
import Text from "./shape/Text";
import { EllipseData, TextData } from "./shape/types";
import { CircleData, LineData, Point, RectData, Shape } from "./shape/types";

class Editor {
  canvas: HTMLCanvasElement;
  canvasView: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ctxView: CanvasRenderingContext2D;
  tools: Tools;
  shapes: Shape<any>[];

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
    let shape: Line<LineData>;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;
      shape.setData({ x: sx, y: sy, x2: dx, y2: dy });
      shape.stroke(ctxView);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push(shape);
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
    let shape: Rect<RectData>;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      shape.setData({
        x: Math.min(sx, dx),
        y: Math.min(sy, dy),
        w: Math.abs(dx - sx),
        h: Math.abs(dy - sy),
      });
      shape.stroke(ctxView);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push(shape);
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
    let shape: Circle<CircleData>;

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

      shape.setData({ x, y, radius });
      shape.stroke(ctxView);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push(shape);
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

  // 画椭圆
  drawStrokeEllipse() {
    const { ctx, ctxView, canvasView } = this;
    let sx: number, sy: number, dx, dy;
    let mouse = this.getMouse();
    let shape: Ellipse<EllipseData>;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      // 计算夹角
      let angle = Math.atan2(dy - sy, dx - sx);

      // 计算半径
      let radiusX =
        Math.sqrt(
          Math.pow(Math.abs(dx - sx), 2) + Math.pow(Math.abs(dy - sy), 2)
        ) / 2;

      // 计算x，y轴
      let x = radiusX * Math.cos(angle) + sx;
      let y = radiusX * Math.sin(angle) + sy;
      let radiusY = radiusX * 0.6; // 这里假设椭圆短边半径是长边半径的3/5

      shape.setData({ x, y, radiusX, radiusY });
      shape.stroke(ctxView);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push(shape);
      this.drawShapes();

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      // 记住鼠标位置
      sx = mouse.x;
      sy = mouse.y;
      shape = new Ellipse();

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }
  drawShapes() {
    const { shapes, ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
      shape.stroke(ctx, true);
    });
  }

  dragShape() {
    const { ctxView, canvasView, shapes } = this;
    let curShape: Shape<any>;
    let x1 = 0;
    let y1 = 0;
    let mouse = this.getMouse();

    const onMouseMove = () => {
      this.clearRect();

      let d = mouse.x - x1;
      let f = mouse.y - y1;

      ctxView.save();
      ctxView.setTransform(1, 0, 0, 1, d, f);
      curShape.fill(ctxView, "green");
      ctxView.restore();
    };

    const onMouseUp = () => {
      this.clearRect();
      // 将视图层copy到缓冲层
      curShape.setTranslate(mouse.x - x1, mouse.y - y1);
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
        let shape = shapes[i];
        if (shape.checkBorder(mouse)) {
          curShape = shapes[i];
          shapes.splice(i, 1);
          flag = true;
          break;
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
    let shape: Triangle<Point>;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      this.strokeLine(sx, sy, dx, dy);
    };

    const onMouseUp = () => {
      this.clearRect();

      shape.setData({ x: dx, y: dy });
      if (shape.isFinish()) {
        // 将视图层copy到缓冲层
        this.shapes.push(shape);
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
        shape.setData({ x: sx, y: sy });

        isFirstPoint = false;
      }

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }

  // 画多边形
  drawStrokePolygon() {
    const { ctx, canvasView } = this;
    let sx: number, sy: number, dx: number, dy: number;
    let mouse = this.getMouse();
    let isFirstPoint = true;
    let shape: Polygon<Point>;

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      this.strokeLine(sx, sy, dx, dy);
    };

    const onMouseUp = () => {
      this.clearRect();

      if (shape.isFinish(mouse)) {
        // 将视图层copy到缓冲层
        this.shapes.push(shape);
        this.drawShapes();

        isFirstPoint = true;
      } else {
        shape.setData({ x: dx, y: dy });
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
        shape = new Polygon();
        shape.setData({ x: sx, y: sy });

        isFirstPoint = false;
      }

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }

  // 画文本
  drawStrokeText() {
    const { canvasView } = this;
    let mouse = this.getMouse();
    let shape: Text<TextData>;

    canvasView.onmousedown = () => {
      shape = new Text();
      shape.setData({ ...mouse, text: "hello world" });

      // 将视图层copy到缓冲层
      this.shapes.push(shape);
      this.drawShapes();
    };
  }
}

export default Editor;
