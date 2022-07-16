import { Canvas2DApplication } from "./application";
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./event";
import Math2D from "./math/math2d";
import Vec2 from "./math/vec2";
import { Colors } from "./util";

export default class Editor extends Canvas2DApplication {
  isSupportMouseMove = true;
  mouse: Vec2;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.mouse = Vec2.create();
    this.init();
  }
  init() {
    // this.start();
  }
  getMouse() {
    return this.mouse;
  }
  // 绘制网格线
  public strokeGrid(color: string = "grey", interval: number = 10): void {
    if (this.context2D !== null) {
      this.context2D.save();
      this.context2D.strokeStyle = color;
      this.context2D.lineWidth = 0.5;
      for (
        let i: number = interval + 0.5;
        i < this.canvas.width;
        i += interval
      ) {
        this.strokeLine(i, 0, i, this.canvas.height);
      }
      for (
        let i: number = interval + 0.5;
        i < this.canvas.height;
        i += interval
      ) {
        this.strokeLine(0, i, this.canvas.width, i);
      }
      this.context2D.restore();
      this.fillCircle(0, 0, 5, "green");
      this.strokeCoord(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // 绘制调色板
  public drawColor() {
    const colorCanvas = this.getColorCanvas();
    this.context2D?.drawImage(colorCanvas, 0, 0);
  }
  // 绘制中心点坐标系
  public drawCanvasCoordCenter(): void {
    if (this.context2D === null) {
      return;
    }
    let halfWidth: number = this.canvas.width * 0.5;
    let halfHeight: number = this.canvas.height * 0.5;

    this.context2D.save();
    this.context2D.lineWidth = 2;
    this.context2D.strokeStyle = "rgba( 255 , 0 , 0 , 0.5 ) ";

    this.strokeLine(0, halfHeight, this.canvas.width, halfHeight);
    this.context2D.strokeStyle = "rgba( 0 , 0 , 255 , 0.5 )";

    this.strokeLine(halfWidth, 0, halfWidth, this.canvas.height);
    this.context2D.restore();

    this.fillCircle(halfWidth, halfHeight, 5, "rgba( 0 , 0 , 0 , 0.5 ) ");
  }

  doTransform() {
    const { context2D, canvas } = this;
    if (!context2D) return;
    context2D?.save();
    const radian = Math2D.toRadian(20);
    context2D?.rotate(radian);
    context2D?.translate(canvas.width / 2, canvas.height / 2);
    context2D.fillStyle = "red";
    context2D?.fillRect(0, 0, 100, 50);
    context2D.restore();
  }

  private strokeLine(x0: number, y0: number, x1: number, y1: number): void {
    if (this.context2D !== null) {
      this.context2D.beginPath();
      this.context2D.moveTo(x0, y0);
      this.context2D.lineTo(x1, y1);
      this.context2D.stroke();
    }
  }

  private fillCircle(
    x: number,
    y: number,
    radius: number,
    fillStyle: string | CanvasGradient | CanvasPattern = "red"
  ): void {
    if (this.context2D !== null) {
      this.context2D.save();
      this.context2D.fillStyle = fillStyle;
      this.context2D.beginPath();
      this.context2D.arc(x, y, radius, 0, Math.PI * 2);
      this.context2D.fill();
      this.context2D.restore();
    }
  }
  private strokeCoord(
    orginX: number,
    orginY: number,
    width: number,
    height: number,
    lineWidth: number = 3
  ): void {
    if (this.context2D !== null) {
      this.context2D.save();
      this.context2D.lineWidth = lineWidth;
      this.context2D.strokeStyle = "red";
      this.strokeLine(orginX, orginY, orginX + width, orginY);
      this.context2D.strokeStyle = "blue";
      this.strokeLine(orginX, orginY, orginX, orginY + height);
      this.context2D.restore();
    }
  }

  // 离屏canvas
  private getColorCanvas(amount: number = 30): HTMLCanvasElement {
    let step: number = 4;
    let canvas: HTMLCanvasElement = document.createElement(
      "canvas"
    ) as HTMLCanvasElement;
    canvas.width = amount * step;
    canvas.height = amount * step;
    let context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (context === null) {
      alert("离屏Canvas获取渲染上下文失败！");
      throw new Error("离屏Canvas获取渲染上下文失败！");
    }

    for (let i: number = 0; i < step; i++) {
      for (let j: number = 0; j < step; j++) {
        let idx: number = step * i + j;
        context.save();
        context.fillStyle = Colors[idx];
        context.fillRect(i * amount, j * amount, amount, amount);
        context.restore();
      }
    }

    return canvas;
  }
  protected dispatchMouseMove(evt: CanvasMouseEvent): void {
    this.mouse = evt.canvasPosition;
  }
  protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
    console.log(" key : " + evt.key + " is down ");
  }

  protected dispatchMouseDown(evt: CanvasMouseEvent): void {
    console.log(" canvasPosition : " + evt.canvasPosition);
  }
}
