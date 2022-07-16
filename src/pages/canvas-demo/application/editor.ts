import { Canvas2DApplication } from "./application";
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./event";
import Math2D from "./math/math2d";
import Vec2 from "./math/vec2";
import { Colors } from "./util";
import Tank from "./Tank";
import vec2 from "./math/vec2";
import mat2d from "./math/mat2d";

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
  private _timer: string | number | NodeJS.Timeout | undefined;
  private _isDrawTank = false;
  private _isDrawMouseLine = false;
  private _isDrawPointInXXX = false;

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
    //tank.scaleX = 2; // 效果是，原来tank的宽度只有80，放大两倍后，宽度变为160，但是在draw的时候，传的坐标还是80的
    //tank.scaleY = 2;
    //tank.tankRotation = Math2D.toRadian(30);
    //tank.turretRotation = Math2D.toRadian(-30);
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

  public strokeLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    lineWidth = 2
  ): void {
    if (this.context2D !== null) {
      this.context2D.save();
      this.context2D.lineWidth = lineWidth;
      this.context2D.beginPath();
      this.context2D.moveTo(x0, y0);
      this.context2D.lineTo(x1, y1);
      this.context2D.stroke();

      this.context2D.restore();
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

    if (this.tank && this._isDrawTank) {
      this.tank.onMouseMove(evt);
      this.drawTank();

      this._timer && clearInterval(this._timer);
      this._timer = setInterval(() => {
        this.tank?.update(0.1);
        this.drawTank();
      }, 100);
    }
    if (this._isDrawMouseLine) {
      this._hitted = Math2D.projectPointOnLineSegment(
        Vec2.create(evt.canvasPosition.x, evt.canvasPosition.y),
        this.lineStart,
        this.lineEnd,
        this.closePt
      );
      this.drawMouseLineProjection();
    }

    if (this._isDrawPointInXXX) {
      this.isPointInXXX();
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
        Math2D.toDegree(this.tank.tankRotation.getAngle()).toFixed(2),
      this._mouseX,
      this._mouseY
    );

    this._isDrawTank = true;
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

  public getOrietation() {
    const a = Vec2.getOrientation(new Vec2(0, 0), new Vec2(0, 100)); // 90°
    const a1 = Vec2.getOrientation(new Vec2(0, 100), new Vec2(0, 0)); // -90°
    const b = Vec2.getOrientation(new Vec2(0, 0), new Vec2(0, -100)); // -90°
    const c = Vec2.getOrientation(new Vec2(0, 0), new Vec2(100, 0)); // 0°
    const d = Vec2.getOrientation(new Vec2(0, 0), new Vec2(-100, 0)); // -180°

    console.log(a, a1, b, c, d);
  }

  public drawVec(
    len: number,
    arrowLen: number = 10,
    beginText: string = "",
    endText = "",
    lineWidth: number = 1,
    isLineDash: boolean = false,
    showInfo: boolean = true,
    alpha: boolean = false
  ): void {
    if (this.context2D === null) {
      return;
    }

    if (len < 0) {
      arrowLen = -arrowLen;
    }

    this.context2D.save();
    this.context2D.lineWidth = lineWidth;

    if (isLineDash) {
      this.context2D.setLineDash([2, 2]);
    }

    if (lineWidth > 1) {
      this.fillCircle(0, 0, 5);
    } else {
      this.fillCircle(0, 0, 3);
    }

    this.context2D.save();
    if (alpha === true) {
      this.context2D.strokeStyle = "rgba( 0 , 0 , 0 , 0.3 )";
    }

    this.strokeLine(0, 0, len, 0);

    // 画两个箭头
    this.context2D.save();
    this.strokeLine(len, 0, len - arrowLen, arrowLen);
    this.context2D.restore();

    this.context2D.save();
    this.strokeLine(len, 0, len - arrowLen, -arrowLen);
    this.context2D.restore();

    this.context2D.restore();

    let font: FontType = "15px sans-serif";

    if (beginText !== undefined && beginText.length !== 0) {
      if (len > 0) {
        this.fillText(beginText, 0, 0, "black", "right", "bottom", font);
      } else {
        this.fillText(beginText, 0, 0, "black", "left", "bottom", font);
      }
    }

    len = parseFloat(len.toFixed(2));

    if (beginText !== undefined && endText.length !== 0) {
      if (len > 0) {
        this.fillText(endText, len, 0, "black", "left", "bottom", font);
      } else {
        this.fillText(endText, len, 0, "black", "right", "bottom", font);
      }
    }

    if (showInfo === true) {
      this.fillText(
        Math.abs(len).toString(),
        len * 0.5,
        0,
        "black",
        "center",
        "bottom",
        font
      );
    }

    this.context2D.restore();
  }
  public drawVecFromLine(
    start: Vec2,
    end: Vec2,
    arrowLen: number = 10,
    beginText: string = "",
    endText = "",
    lineWidth: number = 1,
    isLineDash: boolean = false,
    showInfo: boolean = false,
    alpha: boolean = false
  ): number {
    let angle: number = Vec2.getOrientation(start, end, true);
    if (this.context2D !== null) {
      let diff = Vec2.difference(start, end);
      let len: number = diff.length;
      this.context2D.save();
      this.context2D.translate(start.x, start.y);
      this.context2D.rotate(angle);
      this.drawVec(
        len,
        arrowLen,
        beginText,
        endText,
        lineWidth,
        isLineDash,
        showInfo,
        alpha
      );
      this.context2D.restore();
    }
    return angle;
  }

  public drawVecTest() {
    let start = Vec2.create(200, 100);
    let end0 = Vec2.create(400, 100);
    let end1 = Vec2.create(400, 300);

    const a = this.drawVecFromLine(start, end0);
    const b = this.drawVecFromLine(
      start,
      end1,
      10,
      "a",
      "b",
      3,
      false,
      true,
      true
    );
    console.log(a, b);
    // this.drawVec
  }

  public lineStart: Vec2 = Vec2.create(150, 150);
  public lineEnd: Vec2 = Vec2.create(400, 300);
  public closePt: Vec2 = Vec2.create();
  private _hitted: boolean = false;

  public drawMouseLineProjection(): void {
    this._isDrawMouseLine = true;
    this.clearRect();
    if (this.context2D != null) {
      if (this._hitted === false) {
        this.drawVecFromLine(
          this.lineStart,
          this.lineEnd,
          10,
          this.lineStart.toString(),
          this.lineEnd.toString(),
          1,
          false,
          true
        );
      } else {
        let angle: number = 0;
        let mousePt: Vec2 = Vec2.create(this._mouseX, this._mouseY);

        this.context2D.save();
        // 向量
        angle = this.drawVecFromLine(
          this.lineStart,
          this.lineEnd,
          10,
          this.lineStart.toString(),
          this.lineEnd.toString(),
          3,
          false,
          true
        );
        // 投影位置画个圆
        this.fillCircle(this.closePt.x, this.closePt.y, 5);
        // 向量起点到鼠标位置画条线
        this.drawVecFromLine(
          this.lineStart,
          mousePt,
          10,
          "",
          "",
          1,
          true,
          true,
          false
        );
        // 鼠标位置到投影位置画条线
        this.drawVecFromLine(
          mousePt,
          this.closePt,
          10,
          "",
          "",
          1,
          true,
          true,
          false
        );
        this.context2D.restore();

        this.context2D.save();
        this.context2D.translate(this.closePt.x, this.closePt.y);
        this.context2D.rotate(angle);
        this.drawCoordInfo(
          "[" +
            this.closePt.x.toFixed(2) +
            "  ,  " +
            this.closePt.y.toFixed(2) +
            " ]",
          0,
          0
        );
        this.context2D.restore();
        angle = Vec2.getAngle(
          Vec2.difference(this.lineEnd, this.lineStart),
          Vec2.difference(mousePt, this.lineStart),
          false
        );
        this.drawCoordInfo(
          angle.toFixed(2),
          this.lineStart.x + 10,
          this.lineStart.y + 10
        );
      }
    }
  }
  public drawPolygon(
    points: Vec2[],
    ptX: number,
    ptY: number,
    drawSubTriangle: boolean = false,
    strokeStyle = "rgba( 0 , 0 , 0 , 0.5 )"
  ): void {
    if (this.context2D === null) return;
    this.context2D.save();
    this.context2D.strokeStyle = strokeStyle;
    this.context2D.lineWidth = 3;
    this.context2D.translate(ptX, ptY);

    // 绘制多边形
    this.context2D.beginPath();
    this.context2D.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.context2D.lineTo(points[i].x, points[i].y);
    }
    this.context2D.closePath();
    this.context2D.stroke();

    // 绘制虚线，形成子三角形
    if (drawSubTriangle === true) {
      this.context2D.lineWidth = 2;
      this.context2D.setLineDash([3, 3]);
      for (let i: number = 1; i < points.length - 1; i++) {
        this.strokeLine(points[0].x, points[0].y, points[i].x, points[i].y);
      }
    }

    this.fillCircle(points[0].x, points[0].y, 5, "red");
    this.context2D.restore();
  }

  public isPointInXXX() {
    this._isDrawPointInXXX = true;
    this.clearRect();

    this.isPointInCircle();
    this.isPointInLineSegment();
    this.isPointInTriangle();
    this.isPointInPolygon();
  }

  public isPointInCircle() {
    const circle = new Vec2(100, 100);
    const radius = 50;

    if (Math2D.isPointInCircle(this.mouse, circle, radius)) {
      this.fillCircle(circle.x, circle.y, 50, "blue");
    } else {
      this.fillCircle(circle.x, circle.y, 50);
    }
  }

  public isPointInLineSegment() {
    const start = new Vec2(200, 100);
    const end = new Vec2(250, 250);
    const radius = 5;

    if (Math2D.isPointOnLineSegment(this.mouse, start, end, radius)) {
      this.strokeLine(start.x, start.y, end.x, end.y, 5);
    } else {
      this.strokeLine(start.x, start.y, end.x, end.y, 2);
    }
  }

  public isPointInTriangle() {
    const p1 = new Vec2(300, 300);
    const p2 = new Vec2(300, 350);
    const p3 = new Vec2(350, 350);

    if (Math2D.isPointInTriangle(this.mouse, p1, p2, p3)) {
      this.strokeLine(p1.x, p1.y, p2.x, p2.y, 5);
      this.strokeLine(p1.x, p1.y, p3.x, p3.y, 5);
      this.strokeLine(p3.x, p3.y, p2.x, p2.y, 5);
    } else {
      this.strokeLine(p1.x, p1.y, p2.x, p2.y, 2);
      this.strokeLine(p1.x, p1.y, p3.x, p3.y, 2);
      this.strokeLine(p3.x, p3.y, p2.x, p2.y, 2);
    }
  }
  public isPointInPolygon() {
    if (this.context2D) {
      this.context2D.save();
      this.context2D.translate(-250, 0);
      const points = [
        vec2.create(-100, -50),
        vec2.create(0, -100),
        vec2.create(100, -50),
        vec2.create(100, 50),
        vec2.create(0, 100),
        vec2.create(-100, 50),
      ];
      const pt = new Vec2(this.mouse.x - 400 - -250, this.mouse.y - 300 - 0);
      if (Math2D.isPointInPolygon(pt, points)) {
        this.drawPolygon(points, 400, 300, true, "red");
      } else {
        this.drawPolygon(points, 400, 300, true);
      }

      this.context2D.restore();

      this.context2D.save();
      this.context2D.translate(425, 325);
      this.drawPolygon(
        [
          vec2.create(0, 0),
          vec2.create(100, -100),
          vec2.create(100, 50),
          vec2.create(-100, 50),
          vec2.create(-100, -100),
        ],
        0,
        0
      );
      this.context2D.restore();
    }
  }

  public transform(mat: mat2d): void {
    if (this.context2D === null) {
      return;
    }
    this.context2D.transform(
      mat.values[0],
      mat.values[1],
      mat.values[2],
      mat.values[3],
      mat.values[4],
      mat.values[5]
    );
  }

  public setTransform(mat: mat2d): void {
    if (this.context2D === null) {
      return;
    }

    this.context2D.setTransform(
      mat.values[0],
      mat.values[1],
      mat.values[2],
      mat.values[3],
      mat.values[4],
      mat.values[5]
    );
  }
}
