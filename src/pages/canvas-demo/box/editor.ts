import Tools from "../basic/tools";
import avatar from "../images/avatar.jpg";

const R = Math.PI / 180;
class Editor {
  canvas: HTMLCanvasElement;
  canvasView: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ctxView: CanvasRenderingContext2D;
  tools: Tools;

  constructor(canvas: HTMLCanvasElement, canvasView: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasView = canvasView;

    this.ctx = canvas.getContext("2d")!;
    this.ctxView = canvasView.getContext("2d")!;
    this.tools = new Tools();

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
  // 画线
  drawLine() {
    const { ctx, canvasView } = this;
    let sx: number, sy: number, dx, dy;

    const onMouseMove = () => {
      this.clearRect();
      let mouse = this.getMouse();
      dx = mouse.x;
      dy = mouse.y;

      this.strokeLine(sx, sy, dx, dy);
    };

    const onMouseUp = () => {
      // 将视图层copy到缓冲层
      ctx.drawImage(canvasView, 0, 0);

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

  // 画矩形
  drawStrokeRect() {
    const { ctx, canvasView } = this;
    let sx: number, sy: number, dx, dy;

    const onMouseMove = () => {
      this.clearRect();
      let mouse = this.getMouse();
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
      ctx.drawImage(canvasView, 0, 0);

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
}

export default Editor;
