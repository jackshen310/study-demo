import { mat2d, Vec2 as vec2, Inset } from "../math";
import { CanvasMouseEvent, CanvasKeyBoardEvent } from "../event";
import {
  Rect,
  Circle,
  Grid,
  Ellipse,
  Line,
  ConvexPolygon,
  Scale9Grid,
  BezierPath,
} from "./shapes";
import { Sprite2D } from "./sprite2d";

export enum ERenderType {
  CUSTOM,
  STROKE,
  FILL,
  STROKE_FILL,
  CLIP,
}

export interface ITransformable {
  x: number;
  y: number;

  rotation: number;

  scaleX: number;
  scaleY: number;

  getWorldMatrix(): mat2d; // 获取全局坐标系
  getLocalMatrix(): mat2d; // 获取局部坐标系
}

export interface IRenderState {
  isVisible: boolean;
  showCoordSystem: boolean;
  lineWidth: number;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  renderType: ERenderType;
}

export interface IHittable {
  hitTest(localPt: vec2, transform: ITransformable): boolean;
}

export interface IDrawable {
  beginDraw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void;
  draw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void;
  endDraw(
    transformable: ITransformable,
    state: IRenderState,
    context: CanvasRenderingContext2D
  ): void;
}

export interface IShape extends IHittable, IDrawable {
  readonly type: string;
  data: any;
}

export interface ISpriteContainer {
  name: string;
  start(): void;
  addSprite(sprite: ISprite): ISpriteContainer;
  removeSprite(sprite: ISprite): boolean;
  removeAll(includeThis: boolean): void;
  getSpriteIndex(sprite: ISprite): number;
  getSprite(idx: number): ISprite;
  getSpriteCount(): number;
  getParentSprite(): ISprite | undefined;
  readonly sprite: ISprite | undefined;
}

export enum EOrder {
  PREORDER,
  POSTORDER,
}

export type UpdateEventHandler = (
  spr: ISprite,
  mesc: number,
  diffSec: number,
  travelOrder: EOrder
) => void;
export type MouseEventHandler = (spr: ISprite, evt: CanvasMouseEvent) => void;
export type KeyboardEventHandler = (
  spr: ISprite,
  evt: CanvasKeyBoardEvent
) => void;
export type RenderEventHandler = (
  spr: ISprite,
  context: CanvasRenderingContext2D,
  renderOreder: EOrder
) => void;

export interface ISprite extends ITransformable, IRenderState {
  name: string;
  shape: IShape;
  owner: ISpriteContainer; // 通过owner找到容器对象
  data: any;
  // 点选碰撞检测
  hitTest(localPt: vec2): boolean;
  // 更新
  update(mesc: number, diff: number, order: EOrder): void;
  // 绘制
  draw(context: CanvasRenderingContext2D): void;
  // 事件处理
  mouseEvent: MouseEventHandler | null;
  keyEvent: KeyboardEventHandler | null;
  updateEvent: UpdateEventHandler | null;
  renderEvent: RenderEventHandler | null;
}

export interface IDispatcher {
  readonly container: ISpriteContainer;
  dispatchUpdate(msec: number, diffSec: number): void;
  dispatchDraw(context: CanvasRenderingContext2D): void;
  dispatchMouseEvent(evt: CanvasMouseEvent): void;
  dispatchKeyEvent(evt: CanvasKeyBoardEvent): void;
}

export class SpriteFactory {
  public static createGrid(
    w: number,
    h: number,
    xStep: number = 10,
    yStep: number = 10
  ): IShape {
    return new Grid(w, h, xStep, yStep);
  }

  public static createCircle(radius: number): IShape {
    return new Circle(radius);
  }

  public static createRect(
    w: number,
    h: number,
    u: number = 0,
    v: number = 0
  ): IShape {
    return new Rect(w, h, u, v);
  }

  public static createEllipse(radiusX: number, radiusY: number): IShape {
    return new Ellipse(radiusX, radiusY);
  }

  public static createPolygon(points: vec2[]): IShape {
    if (points.length < 3) {
      throw new Error("多边形顶点数量必须大于或等于3!!!");
    }
    return new ConvexPolygon(points);
  }

  public static createScale9Grid(
    data: Scale9Data,
    width: number,
    height: number,
    u: number = 0,
    v: number = 0
  ): IShape {
    return new Scale9Grid(data, width, height, u, v);
  }

  public static createLine(start: vec2, end: vec2): IShape {
    let line: Line = new Line();
    line.start = start;
    line.end = end;
    return line;
  }

  public static createXLine(len: number = 10, t: number = 0): IShape {
    return new Line(len, t);
  }

  public static createBezierPath(
    points: vec2[],
    isCubic: boolean = false
  ): IShape {
    return new BezierPath(points, isCubic);
  }

  public static createSprite(shape: IShape, name: string = ""): ISprite {
    let spr: ISprite = new Sprite2D(shape, name);
    return spr;
  }

  public static createISprite(
    shape: IShape,
    x: number = 0,
    y: number = 0,
    rotation: number = 0,
    scaleX: number = 1.0,
    scaleY: number = 1.0,
    name: string = " "
  ): ISprite {
    let spr: ISprite = new Sprite2D(shape, name);
    spr.x = x;
    spr.y = y;
    spr.rotation = rotation;
    spr.scaleX = scaleX;
    spr.scaleY = scaleY;
    return spr;
  }
}

export enum EImageFillType {
  NONE,
  STRETCH,
  REPEAT,
  REPEAT_X,
  REPEAT_Y,
}

export class Scale9Data {
  public image: HTMLImageElement;
  private _inset: Inset;

  public set inset(value: Inset) {
    this._inset = value;
  }

  public get leftMargin(): number {
    return this._inset.leftMargin;
  }

  public get rightMargin(): number {
    return this._inset.rightMargin;
  }

  public get topMargin(): number {
    return this._inset.topMargin;
  }

  public get bottomMargin(): number {
    return this._inset.bottomMargin;
  }

  public constructor(image: HTMLImageElement, inset: Inset) {
    this.image = image;
    this._inset = inset;
  }
}
