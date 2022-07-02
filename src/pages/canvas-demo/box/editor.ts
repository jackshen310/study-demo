import Tools from "../basic/tools";
import avatar from "../images/avatar.jpg";

const R = Math.PI / 180;

type Shape = {
  type: "rect" | "line" | "circle";
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

  // 画描边矩形
  strokeRect(x: number, y: number, w: number, h: number) {
    const { ctxView } = this;
    ctxView.strokeRect(x, y, w, h);
  }

  // 画描边圆
  strokeCircle(x: number, y: number, radius: number) {
    const { ctxView } = this;

    ctxView.save();
    ctxView.beginPath();
    ctxView.arc(x, y, radius, 0, 360 * R);
    ctxView.stroke();
    ctxView.restore();

    return { x, y, radius };
  }
  // 画线
  drawLine() {
    const { ctx, canvasView } = this;
    let sx: number, sy: number, dx, dy;
    let mouse = this.getMouse();

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      this.strokeLine(sx, sy, dx, dy);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push({
        type: "line",
        prop: {
          sx,
          sy,
          dx: mouse.x,
          dy: mouse.y,
        },
      });
      this.drawShapes();

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      // 记住鼠标位置
      sx = mouse.x;
      sy = mouse.y;

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }

  // 画矩形
  drawStrokeRect() {
    const { ctx, canvasView } = this;
    let sx: number, sy: number, dx, dy;
    let mouse = this.getMouse();

    const onMouseMove = () => {
      this.clearRect();

      dx = mouse.x;
      dy = mouse.y;

      this.strokeRect(
        Math.min(sx, dx),
        Math.min(sy, dy),
        Math.abs(dx - sx),
        Math.abs(dy - sy)
      );
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push({
        type: "rect",
        prop: {
          x: Math.min(sx, mouse.x),
          y: Math.min(sy, mouse.y),
          w: Math.abs(mouse.x - sx),
          h: Math.abs(mouse.y - sy),
        },
      });
      this.drawShapes();

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      // 记住鼠标位置
      sx = mouse.x;
      sy = mouse.y;

      canvasView.addEventListener("mousemove", onMouseMove);
      canvasView.addEventListener("mouseup", onMouseUp);
    };
  }

  // 画圆
  drawStrokeCircle() {
    const { ctx, canvasView } = this;
    let sx: number, sy: number, dx, dy;
    let mouse = this.getMouse();
    let prop: any = null;

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

      prop = this.strokeCircle(x, y, radius);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      this.shapes.push({
        type: "circle",
        prop,
      });
      this.drawShapes();

      canvasView.removeEventListener("mousemove", onMouseMove);
      canvasView.removeEventListener("mouseup", onMouseUp);
    };

    canvasView.onmousedown = () => {
      // 记住鼠标位置
      let mouse = this.getMouse();
      sx = mouse.x;
      sy = mouse.y;

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
        ctx.strokeRect(prop.x, prop.y, prop.w, prop.h);
      } else if (type === "circle") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(prop.x, prop.y, prop.radius, 0, 360 * R);
        ctx.stroke();
        ctx.restore();
      } else if (type === "line") {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(prop.sx, prop.sy);
        ctx.lineTo(prop.dx, prop.dy);
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  checkRect(x: number, y: number, w: number, h: number) {
    let mouse = this.getMouse();
    return mouse.x > x && mouse.x < x + w && mouse.y > y && mouse.y < y + h;
  }

  checkArc(x: number, y: number, radius: number) {
    let mouse = this.getMouse();
    let dx = mouse.x - x;
    let dy = mouse.y - y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < radius) {
      return true;
    } else {
      return false;
    }
  }
  dragShape() {
    const { ctx, ctxView, canvasView, shapes } = this;
    let sx: number, sy: number, dx, dy;
    let curShape: Shape;
    let x1 = 0;
    let y1 = 0;

    const onMouseMove = () => {
      this.clearRect();
      let mouse = this.getMouse();

      const { type, prop } = curShape;
      if (type === "rect") {
        ctxView.save();
        ctxView.fillStyle = "green";
        prop.x = mouse.x - x1;
        prop.y = mouse.y - y1;
        ctxView.fillRect(prop.x, prop.y, prop.w, prop.h);
        ctxView.restore();
      } else if (type === "circle") {
        ctxView.save();
        ctxView.beginPath();
        ctxView.fillStyle = "red";
        prop.x = mouse.x - x1;
        prop.y = mouse.y - y1;
        ctxView.arc(prop.x, prop.y, prop.radius, 0, 360 * R);
        ctxView.fill();
        ctxView.restore();
      } else if (type === "line") {
        let x2 = prop.dx - prop.sx;
        let y2 = (prop.dy = prop.sy);
        prop.sx = mouse.x - x1;
        prop.sy = mouse.y - y1;
        prop.dx = x2 + prop.sx;
        prop.dy = y2 + prop.sy;
        this.strokeLine(prop.sx, prop.sy, prop.dx, prop.dy);
      }
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
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
          if (this.checkRect(prop.x, prop.y, prop.w, prop.h)) {
            curShape = shapes[i];
            shapes.splice(i, 1);
            flag = true;
            break;
          }
        } else if (type === "circle") {
          if (this.checkArc(prop.x, prop.y, prop.radius)) {
            curShape = shapes[i];
            shapes.splice(i, 1);
            flag = true;
            break;
          }
        } else if (type === "line") {
          // TODO
        }
      }
      if (flag) {
        x1 = mouse.x - curShape.prop.x;
        y1 = mouse.y - curShape.prop.y;
        this.drawShapes();

        canvasView.addEventListener("mousemove", onMouseMove);
        canvasView.addEventListener("mouseup", onMouseUp);
      }
    };
  }
}

export default Editor;
