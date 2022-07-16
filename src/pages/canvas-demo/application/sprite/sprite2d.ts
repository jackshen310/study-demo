import { mat2d, Transform2D, Vec2 } from "../math";
import {
  ISprite,
  MouseEventHandler,
  KeyboardEventHandler,
  UpdateEventHandler,
  EOrder,
  IShape,
  ERenderType,
  ISpriteContainer,
  RenderEventHandler,
} from "./interface";

export class Sprite2D implements ISprite {
  public showCoordSystem: boolean = false;
  public renderType: ERenderType = ERenderType.FILL;
  public isVisible: boolean = true;
  public fillStyle: string | CanvasGradient | CanvasPattern = "white";
  public strokeStyle: string | CanvasGradient | CanvasPattern = "black";
  public lineWidth: number = 1;

  public transform: Transform2D = new Transform2D();

  public name: string;
  public shape: IShape;
  public data: any;
  public owner!: ISpriteContainer;

  public mouseEvent: MouseEventHandler | null = null;
  public keyEvent: KeyboardEventHandler | null = null;
  public updateEvent: UpdateEventHandler | null = null;
  public renderEvent: RenderEventHandler | null = null;

  public constructor(shape: IShape, name: string) {
    this.name = name;
    this.shape = shape;
  }

  public set x(x: number) {
    this.transform.position.x = x;
  }

  public get x(): number {
    return this.transform.position.x;
  }

  public set y(y: number) {
    this.transform.position.y = y;
  }

  public get y(): number {
    return this.transform.position.y;
  }

  public set rotation(rotation: number) {
    this.transform.rotation = rotation;
  }

  public get rotation(): number {
    return this.transform.rotation;
  }

  public set scaleX(s: number) {
    this.transform.scale.x = s;
  }

  public get scaleX(): number {
    return this.transform.scale.x;
  }

  public set scaleY(s: number) {
    this.transform.scale.y = s;
  }

  public get scaleY(): number {
    return this.transform.scale.y;
  }

  public getWorldMatrix(): mat2d {
    return this.transform.toMatrix();
  }

  public getLocalMatrix(): mat2d {
    let src: mat2d = this.getWorldMatrix();
    let out: mat2d = mat2d.create();
    if (mat2d.invert(src, out)) {
      return out;
    } else {
      alert("矩阵求逆失败");
      throw new Error("矩阵求逆失败");
    }
  }

  public update(mesc: number, diff: number, order: EOrder): void {
    if (this.updateEvent) {
      this.updateEvent(this, mesc, diff, order);
    }
  }

  public hitTest(localPt: Vec2): boolean {
    if (this.isVisible) {
      return this.shape.hitTest(localPt, this);
    } else {
      return false;
    }
  }

  public draw(context: CanvasRenderingContext2D): void {
    if (this.isVisible) {
      this.shape.beginDraw(this, this, context);
      if (this.renderEvent !== null) {
        this.renderEvent(this, context, EOrder.PREORDER);
      }
      this.shape.draw(this, this, context);
      if (this.renderEvent !== null) {
        this.renderEvent(this, context, EOrder.POSTORDER);
      }
      this.shape.endDraw(this, this, context);
    }
  }
}
