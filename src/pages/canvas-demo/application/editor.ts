import { Canvas2DApplication } from "./application";
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./event";
import Math2D from "./math/math2d";
import Vec2 from "./math/vec2";
import { Colors } from "./util";
import Tank from "./Tank";

type TextAlign = "start" | "left" | "center" | "right" | "end";

type TextBaseline = "alphabetic" | "hanging" | "top" | "middle" | "bottom";

type FontType =
  | "10px sans-serif"
  | "15px sans-serif"
  | "20px sans-serif"
  | "25px sans-serif";

type PatternRepeat = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";

type FontStyle = "normal" | "italic" | "oblique";

type FontVariant = "normal" | "small-caps";

type FontWeight =
  | "normal"
  | "bold"
  | "bolder"
  | "lighter"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

type FontSize =
  | "10px"
  | "12px"
  | "16px"
  | "18px"
  | "24px"
  | "50%"
  | "75%"
  | "100%"
  | "125%"
  | "150%"
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large";

type FontFamily = "sans-serif" | "serif" | "courier" | "fantasy" | "monospace";

export default class Editor extends Canvas2DApplication {
  isSupportMouseMove = true;
  mouse: Vec2;
  tank: Tank | null;
  private _mouseX = 0;
  private _mouseY = 0;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.mouse = Vec2.create();
    this.tank = null;
    this.init();
  }
  init() {
    // this.start();
    this.initTank();
  }
  initTank() {
    const tank = new Tank();
    tank.initYAxis = false;
    // tank在中心点
    tank.x = this.canvas.width * 0.5;
    tank.y = this.canvas.height * 0.5;
    tank.scaleX = 2; // 效果是，原来tank的宽度只有80，放大两倍后，宽度变为160，但是在draw的时候，传的坐标还是80的
    tank.scaleY = 2;
    tank.tankRotation = Math2D.toRadian(30);
    tank.turretRotation = Math2D.toRadian(-30);
    this.tank = tank;
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

  public doTransform() {
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

  public strokeLine(x0: number, y0: number, x1: number, y1: number): void {
    if (this.context2D !== null) {
      this.context2D.beginPath();
      this.context2D.moveTo(x0, y0);
      this.context2D.lineTo(x1, y1);
      this.context2D.stroke();
    }
  }

  public fillCircle(
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

  // 画坐标系
  public strokeCoord(
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

    this._mouseX = evt.canvasPosition.x;
    this._mouseY = evt.canvasPosition.y;

    if (this.tank) {
      this.tank.onMouseMove(evt);
      this.drawTank();
    }
  }
  protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
    console.log(" key : " + evt.key + " is down ");
  }

  protected dispatchMouseDown(evt: CanvasMouseEvent): void {
    console.log(" canvasPosition : " + evt.canvasPosition);
  }
  public fillText(
    text: string,
    x: number,
    y: number,
    color: string = "white",
    align: TextAlign = "left",
    baseline: TextBaseline = "top",
    font: FontType = "10px sans-serif"
  ): void {
    if (this.context2D !== null) {
      this.context2D.save();
      this.context2D.textAlign = align;
      this.context2D.textBaseline = baseline;
      this.context2D.font = font;
      this.context2D.fillStyle = color;
      this.context2D.fillText(text, x, y);
      this.context2D.restore();
    }
  }
  // 画坦克
  public drawTank() {
    if (!this.tank) {
      return;
    }
    this.clearRect();
    this.strokeGrid(); // 网格线
    this.draw4Quadrant(); // 四象限
    this.drawCanvasCoordCenter(); // 中心原点坐标系
    this.tank.draw(this);

    this.drawCoordInfo(
      "坐标 : [" +
        (this._mouseX - this.tank.x).toFixed(2) +
        "," +
        (this._mouseY - this.tank.y).toFixed(2) +
        "] 角度 : " +
        Math2D.toDegree(this.tank.tankRotation).toFixed(2),
      this._mouseX,
      this._mouseY
    );
  }
  public drawCoordInfo(info: string, x: number, y: number): void {
    this.fillText(info, x, y, "black", "center", "bottom");
  }
  // 四象限
  public draw4Quadrant(): void {
    if (this.context2D === null) {
      return;
    }

    this.context2D.save();

    this.fillText(
      "第一象限",
      this.canvas.width,
      this.canvas.height,
      "rgba( 0 , 0 , 255 , 0.5 )",
      "right",
      "bottom",
      "20px sans-serif"
    );
    this.fillText(
      "第二象限",
      0,
      this.canvas.height,
      "rgba( 0 , 0 , 255 , 0.5 )",
      "left",
      "bottom",
      "20px sans-serif"
    );
    this.fillText(
      "第三象限",
      0,
      0,
      "rgba( 0 , 0 , 255 , 0.5 )",
      "left",
      "top",
      "20px sans-serif"
    );
    this.fillText(
      "第四象限",
      this.canvas.width,
      0,
      "rgba( 0 , 0 , 255 , 0.5 )",
      "right",
      "top",
      "20px sans-serif"
    );

    this.context2D.restore();
  }
}
