import {
  CanvasMouseEvent,
  CanvasKeyBoardEvent,
  EInputEventType,
} from "../event";
import { ISpriteContainer, IDispatcher, ISprite, EOrder } from "./interface";
import { mat2d, Math2D } from "../math";

export class Sprite2DManager implements ISpriteContainer, IDispatcher {
  public name: string = "sprite2dManager";
  private _sprites: ISprite[] = [];
  public _isRuning = false;

  public start() {
    this._isRuning = true;
  }
  public stop() {
    this._isRuning = false;
  }
  public addSprite(sprite: ISprite): ISpriteContainer {
    sprite.owner = this;
    this._sprites.push(sprite);
    return this;
  }

  public removeSpriteAt(idx: number): void {
    this._sprites.splice(idx, 1);
  }

  public removeSprite(sprite: ISprite): boolean {
    let idx = this.getSpriteIndex(sprite);
    if (idx !== -1) {
      this.removeSpriteAt(idx);
      return true;
    }
    return false;
  }

  public removeAll(): void {
    this._sprites = [];
  }

  public getSprite(idx: number): ISprite {
    if (idx < 0 || idx > this._sprites.length - 1) {
      throw new Error("参数idx越界!!");
    }
    return this._sprites[idx];
  }

  public getSpriteCount(): number {
    return this._sprites.length;
  }

  public getSpriteIndex(sprite: ISprite): number {
    for (let i = 0; i < this._sprites.length; i++) {
      if (this._sprites[i] === sprite) {
        return i;
      }
    }
    return -1;
  }

  public getParentSprite(): ISprite | undefined {
    return undefined;
  }

  public sprite: ISprite | undefined = undefined;

  private _dragSprite: ISprite | undefined = undefined;

  public get container(): ISpriteContainer {
    return this;
  }

  public dispatchUpdate(msec: number, diff: number): void {
    // 触发PREORDER updateEvent
    for (let i = 0; i < this._sprites.length; i++) {
      this._sprites[i].update(msec, diff, EOrder.PREORDER);
    }
    // 触发POSTORDER updateEvent
    for (let i = this._sprites.length - 1; i >= 0; i--) {
      this._sprites[i].update(msec, diff, EOrder.POSTORDER);
    }
  }

  public dispatchDraw(context: CanvasRenderingContext2D): void {
    for (let i = 0; i < this._sprites.length; i++) {
      this._sprites[i].draw(context);
    }
  }

  public dispatchKeyEvent(evt: CanvasKeyBoardEvent): void {
    let spr: ISprite;
    if (!this._isRuning) return;
    for (let i = 0; i < this._sprites.length; i++) {
      spr = this._sprites[i];
      if (spr.keyEvent) {
        // 有键盘处理事件的就触发
        spr.keyEvent(spr, evt);
      }
    }
  }

  public dispatchMouseEvent(evt: CanvasMouseEvent): void {
    if (!this._isRuning) return;
    if (evt.type === EInputEventType.MOUSEUP) {
      this._dragSprite = undefined;
    } else if (evt.type === EInputEventType.MOUSEDRAG) {
      if (this._dragSprite !== undefined) {
        if (this._dragSprite.mouseEvent !== null) {
          this._dragSprite.mouseEvent(this._dragSprite, evt);
          return;
        }
      }
    }

    let spr: ISprite;
    for (let i = this._sprites.length - 1; i >= 0; i--) {
      spr = this._sprites[i];
      let mat: mat2d | null = spr.getLocalMatrix();
      Math2D.transform(mat!, evt.canvasPosition, evt.localPosition);
      if (spr.hitTest(evt.localPosition)) {
        evt.hasLocalPosition = true;
        if (evt.button === 0 && evt.type === EInputEventType.MOUSEDOWN) {
          this._dragSprite = spr;
        }

        if (evt.type === EInputEventType.MOUSEDRAG) {
          return;
        }
        // 有选中的精灵，并且有事件处理程序
        if (spr.mouseEvent) {
          spr.mouseEvent(spr, evt);
          return;
        }
      }
    }
  }
}
