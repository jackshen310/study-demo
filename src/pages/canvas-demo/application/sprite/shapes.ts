import {
  IShape,
  ERenderType,
  ITransformable,
  IRenderState,
  Scale9Data,
  EImageFillType,
} from "./interface";
import { mat2d, Math2D, Vec2 as vec2, Rectangle, Size } from "../math";

export abstract class BaseShape2D implements IShape {
  public axisXStyle: string | CanvasGradient | CanvasPattern;
  public axisYStyle: string | CanvasGradient | CanvasPattern;
  public axisLineWidth: number;
  public axisLength: number;
  public data: any;

  public abstract get type(): string;
  public abstract hitTest(localPt: vec2, transform: ITransformable): boolean;

  public constructor() {
    this.axisXStyle = "rgba( 255 , 0 , 0 , 128 ) ";
    this.axisYStyle = "rgba( 0 , 255 , 0 , 128 ) ";
    this.axisLineWidth = 1;
    this.axisLength = 100;
    this.data = undefined;
  }

  protected drawLine(
    ctx: CanvasRenderingContext2D,
    style: string | CanvasGradient | CanvasPattern,
    isAxisX: boolean = true
  ) {
    ctx.save();
    ctx.strokeStyle = style;
    ctx.lineWidth = this.axisLineWidth;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    if (isAxisX) {
      ctx.lineTo(this.axisLength, 0);
    } else {
      ctx.lineTo(0, this.axisLength);
    }
    ctx.stroke();
    ctx.restore();
  }

  public beginDraw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    context.save();
    context.lineWidth = state.lineWidth;
    context.strokeStyle = state.strokeStyle;
    context.fillStyle = state.fillStyle;
    let mat: mat2d = transformable.getWorldMatrix();
    context.setTransform(
      mat.values[0],
      mat.values[1],
      mat.values[2],
      mat.values[3],
      mat.values[4],
      mat.values[5]
    );
  }

  public draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    if (state.renderType === ERenderType.STROKE) {
      context.stroke();
    } else if (state.renderType === ERenderType.FILL) {
      context.fill();
    } else if (state.renderType === ERenderType.STROKE_FILL) {
      context.stroke();
      context.fill();
    } else if (state.renderType === ERenderType.CLIP) {
      context.clip();
    }
  }

  public endDraw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    if (state.renderType !== ERenderType.CLIP) {
      if (state.showCoordSystem) {
        this.drawLine(context, this.axisXStyle, true);
        this.drawLine(context, this.axisYStyle, false);
      }
      context.restore();
    }
  }
}

export class Circle extends BaseShape2D {
  public radius: number;

  public constructor(radius: number = 1) {
    super();
    this.radius = radius;
  }
  public hitTest(localPt: vec2, transform: ITransformable): boolean {
    return Math2D.isPointInCircle(localPt, vec2.create(0, 0), this.radius);
  }

  public draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    context.beginPath();
    context.arc(0, 0, this.radius, 0.0, Math.PI * 2.0, true);
    super.draw(transformable, state, context);
  }

  public get type(): string {
    return "Circle";
  }
}

export class Ellipse extends BaseShape2D {
  public radiusX: number;
  public radiusY: number;
  public constructor(radiusX: number = 10, radiusY: number = 10) {
    super();
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
  public hitTest(localPt: vec2, transform: ITransformable): boolean {
    let isHitted: boolean = Math2D.isPointInEllipse(
      localPt.x,
      localPt.y,
      0,
      0,
      this.radiusX,
      this.radiusY
    );
    return isHitted;
  }

  public draw(
    transform: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    context.beginPath();
    context.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
    super.draw(transform, state, context);
  }

  public get type(): string {
    return "Ellipse";
  }
}

export class ConvexPolygon extends BaseShape2D {
  public points: vec2[];

  public constructor(points: vec2[]) {
    if (points.length < 3) {
      alert("多边形顶点必须大于3或等于3!!");
      new Error("多边形顶点必须大于3或等于3!!");
    }
    if (Math2D.isConvex(points) === false) {
      alert("当前多边形不是凸多边形!!");
      new Error("当前多边形不是凸多边形!!");
    }
    super();
    this.points = points;
  }

  public hitTest(localPt: vec2, transform: ITransformable): boolean {
    return Math2D.isPointInPolygon(localPt, this.points);
  }

  public draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    context.beginPath();
    context.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      context.lineTo(this.points[i].x, this.points[i].y);
    }
    context.closePath();
    super.draw(transformable, state, context);
  }

  public get type(): string {
    return "Polygon";
  }
}

export class Rect extends BaseShape2D {
  public width: number;
  public height: number;
  public x: number;
  public y: number;

  public get right(): number {
    return this.x + this.width;
  }

  public get bottom(): number {
    return this.y + this.height;
  }

  public constructor(
    w: number = 1,
    h: number = 1,
    u: number = 0,
    v: number = 0
  ) {
    super();
    this.width = w;
    this.height = h;
    this.x = -this.width * u;
    this.y = -this.height * v;
  }

  public get type(): string {
    return "Rect";
  }

  public hitTest(localPt: vec2, transform: ITransformable): boolean {
    return Math2D.isPointInRect(
      localPt.x,
      localPt.y,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  public draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + this.width, this.y);
    context.lineTo(this.x + this.width, this.y + this.height);
    context.lineTo(this.x, this.y + this.height);
    context.closePath();
    super.draw(transformable, state, context);
  }
}

export class Grid extends Rect {
  public xStep: number;
  public yStep: number;

  public constructor(
    w: number = 10,
    h: number = 10,
    xStep: number = 10,
    yStep: number = 10
  ) {
    super(w, h, 0, 0);
    this.xStep = xStep;
    this.yStep = yStep;
  }

  public draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    state.renderType = ERenderType.CUSTOM;
    context.fillRect(0, 0, this.width, this.height);

    context.beginPath();
    for (var i = this.xStep + 0.5; i < this.width; i += this.xStep) {
      context.moveTo(i, 0);
      context.lineTo(i, this.height);
    }
    context.stroke();

    context.beginPath();
    for (var i = this.yStep + 0.5; i < this.height; i += this.yStep) {
      context.moveTo(0, i);
      context.lineTo(this.width, i);
    }
    context.stroke();
  }

  public get type(): string {
    return "Grid";
  }
}

export class BezierPath extends BaseShape2D {
  public points: vec2[];
  public isCubic: boolean;

  public constructor(points: vec2[], isCubic: boolean = false) {
    super();
    this.points = points;
    this.isCubic = isCubic;
    this.data = points;
  }

  public get type(): string {
    return "BezierPath";
  }

  public hitTest(localPt: vec2, transform: ITransformable): boolean {
    return false;
  }

  public draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    context.beginPath();
    context.moveTo(this.points[0].x, this.points[0].y);
    if (this.isCubic) {
      for (let i = 1; i < this.points.length; i += 3) {
        context.bezierCurveTo(
          this.points[i].x,
          this.points[i].y,
          this.points[i + 1].x,
          this.points[i + 1].y,
          this.points[i + 2].x,
          this.points[i + 2].y
        );
      }
    } else {
      for (let i: number = 1; i < this.points.length; i += 2) {
        context.quadraticCurveTo(
          this.points[i].x,
          this.points[i].y,
          this.points[i + 1].x,
          this.points[i + 1].y
        );
      }
    }
    super.draw(transformable, state, context);
  }
}

export class Line implements IShape {
  public start: vec2;
  public end: vec2;
  public data: any;

  public constructor(len: number = 10, t: number = 0) {
    if (t < 0.0 || t > 1.0) {
      alert("参数t必须处于 [ 0 , 1 ]之间!!");
      throw new Error("参数t必须处于 [ 0 , 1 ]之间!!");
    }
    this.start = vec2.create(-len * t, 0);
    this.end = vec2.create(len * (1.0 - t), 0);
    this.data = undefined;
  }

  public hitTest(localPt: vec2, transform: ITransformable): boolean {
    return Math2D.isPointOnLineSegment(localPt, this.start, this.end);
  }

  public beginDraw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    context.save();
    context.lineWidth = state.lineWidth;
    context.strokeStyle = state.strokeStyle;
    let mat: mat2d = transformable.getWorldMatrix();
    context.setTransform(
      mat.values[0],
      mat.values[1],
      mat.values[2],
      mat.values[3],
      mat.values[4],
      mat.values[5]
    );
  }

  public draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    state.renderType = ERenderType.STROKE;
    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.end.x, this.end.y);
    context.stroke();
  }

  public endDraw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    context.restore();
  }

  public get type(): string {
    return "Line";
  }
}

export class Scale9Grid extends Rect {
  public data: Scale9Data;
  public srcRects!: Rectangle[];
  public destRects!: Rectangle[];

  public get type(): string {
    return "Scale9Grid";
  }

  public constructor(
    data: Scale9Data,
    width: number,
    height: number,
    u: number,
    v: number
  ) {
    super(width, height, u, v);
    this.data = data;
    this._calcDestRects();
  }

  private _calcDestRects(): void {
    this.destRects = [];
    this.srcRects = [];

    let rc: Rectangle;
    rc = new Rectangle();
    rc.origin = vec2.create(0, 0);
    rc.size = Size.create(this.data.leftMargin, this.data.topMargin);
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(this.x, this.y);
    rc.size = Size.create(this.data.leftMargin, this.data.topMargin);
    this.destRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(this.data.image.width - this.data.rightMargin, 0);
    rc.size = Size.create(this.data.rightMargin, this.data.topMargin);
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(this.right - this.data.rightMargin, this.y);
    rc.size = Size.create(this.data.rightMargin, this.data.topMargin);
    this.destRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(
      this.data.image.width - this.data.rightMargin,
      this.data.image.height - this.data.bottomMargin
    );
    rc.size = Size.create(this.data.rightMargin, this.data.bottomMargin);
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(
      this.right - this.data.rightMargin,
      this.bottom - this.data.bottomMargin
    );
    rc.size = Size.create(this.data.rightMargin, this.data.bottomMargin);
    this.destRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(0, this.data.image.height - this.data.bottomMargin);
    rc.size = Size.create(this.data.leftMargin, this.data.bottomMargin);
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(this.x, this.bottom - this.data.bottomMargin);
    rc.size = Size.create(this.data.leftMargin, this.data.bottomMargin);
    this.destRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(0, this.data.topMargin);
    rc.size = Size.create(
      this.data.leftMargin,
      this.data.image.height - this.data.topMargin - this.data.bottomMargin
    );
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(this.x, this.y + this.data.topMargin);
    rc.size = Size.create(
      this.data.leftMargin,
      this.height - this.data.topMargin - this.data.bottomMargin
    );
    this.destRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(this.data.leftMargin, 0);
    rc.size = Size.create(
      this.data.image.width - this.data.leftMargin - this.data.rightMargin,
      this.data.topMargin
    );
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(this.x + this.data.leftMargin, this.y);
    rc.size = Size.create(
      this.width - this.data.leftMargin - this.data.rightMargin,
      this.data.topMargin
    );
    this.destRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(
      this.data.image.width - this.data.rightMargin,
      this.data.topMargin
    );
    rc.size = Size.create(
      this.data.rightMargin,
      this.data.image.height - this.data.topMargin - this.data.bottomMargin
    );
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(
      this.right - this.data.rightMargin,
      this.y + this.data.topMargin
    );
    rc.size = Size.create(
      this.data.rightMargin,
      this.height - this.data.topMargin - this.data.bottomMargin
    );
    this.destRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(
      this.data.leftMargin,
      this.data.image.height - this.data.bottomMargin
    );
    rc.size = Size.create(
      this.data.image.width - this.data.leftMargin - this.data.rightMargin,
      this.data.bottomMargin
    );
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(
      this.x + this.data.leftMargin,
      this.bottom - this.data.bottomMargin
    );
    rc.size = Size.create(
      this.width - this.data.leftMargin - this.data.rightMargin,
      this.data.bottomMargin
    );
    this.destRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(this.data.leftMargin, this.data.topMargin);
    rc.size = Size.create(
      this.data.image.width - this.data.leftMargin - this.data.rightMargin,
      this.data.image.height - this.data.topMargin - this.data.bottomMargin
    );
    this.srcRects.push(rc);

    rc = new Rectangle();
    rc.origin = vec2.create(
      this.x + this.data.leftMargin,
      this.y + this.data.topMargin
    );
    rc.size = Size.create(
      this.width - this.data.leftMargin - this.data.rightMargin,
      this.height - this.data.topMargin - this.data.bottomMargin
    );
    this.destRects.push(rc);
  }

  private _drawImage(
    context: CanvasRenderingContext2D,
    img: HTMLImageElement | HTMLCanvasElement,
    destRect: Rectangle,
    srcRect: Rectangle,
    fillType: EImageFillType = EImageFillType.STRETCH
  ): boolean {
    if (srcRect.isEmpty()) {
      return false;
    }

    if (destRect.isEmpty()) {
      return false;
    }

    if (fillType === EImageFillType.STRETCH) {
      context.drawImage(
        img,
        srcRect.origin.x,
        srcRect.origin.y,
        srcRect.size.width,
        srcRect.size.height,
        destRect.origin.x,
        destRect.origin.y,
        destRect.size.width,
        destRect.size.height
      );
    } else {
      let rows: number = Math.ceil(destRect.size.width / srcRect.size.width);
      let colums: number = Math.ceil(
        destRect.size.height / srcRect.size.height
      );

      let left: number = 0;
      let top: number = 0;

      let right: number = 0;
      let bottom: number = 0;

      let width: number = 0;
      let height: number = 0;

      let destRight: number = destRect.origin.x + destRect.size.width;
      let destBottom: number = destRect.origin.y + destRect.size.height;

      if (fillType === EImageFillType.REPEAT_X) {
        colums = 1;
      } else if (fillType === EImageFillType.REPEAT_Y) {
        rows = 1;
      }

      for (let i: number = 0; i < rows; i++) {
        for (let j: number = 0; j < colums; j++) {
          left = destRect.origin.x + i * srcRect.size.width;
          top = destRect.origin.y + j * srcRect.size.height;

          width = srcRect.size.width;
          height = srcRect.size.height;

          right = left + width;
          bottom = top + height;

          if (right > destRight) {
            width = srcRect.size.width - (right - destRight);
          }

          if (bottom > destBottom) {
            height = srcRect.size.height - (bottom - destBottom);
          }

          context.drawImage(
            img,
            srcRect.origin.x,
            srcRect.origin.y,
            width,
            height,
            left,
            top,
            width,
            height
          );
        }
      }
    }
    return true;
  }

  public draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void {
    for (let i: number = 0; i < this.srcRects.length; i++) {
      this._drawImage(
        context,
        this.data.image,
        this.destRects[i],
        this.srcRects[i],
        EImageFillType.STRETCH
      );
    }
  }
}
