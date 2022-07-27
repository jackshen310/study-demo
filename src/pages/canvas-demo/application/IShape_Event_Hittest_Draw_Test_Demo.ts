import {
  ISprite,
  SpriteFactory,
  IShape,
  EOrder,
  ERenderType,
  Scale9Data,
} from "./sprite/interface";
import { CanvasMouseEvent, EInputEventType } from "./event";
import { Vec2 as vec2, Math2D, Inset } from "./math";
import { Canvas2DUtil } from "./util/canvas2DUtil";
import Sprite2DApplication from "./editor";
import image from "./data/scale9.png";

export default class IShape_Event_Hittest_Draw_Test_Demo {
  private _app: Sprite2DApplication;
  private _image: HTMLImageElement;
  private _shapes: IShape[] = [];
  private _idx: number;
  private _lastColor: string | CanvasGradient | CanvasPattern;

  public constructor(app: Sprite2DApplication) {
    this._lastColor = "red";
    this._app = app;
    this._idx = 0;

    this._image = document.createElement("img") as HTMLImageElement;
    this._image.src = image;

    this._image.onload = (ev: Event): void => {
      this._createShapes();
      this.createSprites();
      this._app.start();
    };
  }

  private createSprites(): void {
    let grid: IShape = SpriteFactory.createGrid(
      this._app.canvas.width,
      this._app.canvas.height
    );
    let gridSprite: ISprite = SpriteFactory.createSprite(grid, "grid");
    gridSprite.fillStyle = "white";
    gridSprite.strokeStyle = "black";
    this._app.rootContainer.addSprite(gridSprite);
    gridSprite.mouseEvent = (s: ISprite, evt: CanvasMouseEvent): void => {
      if (this._shapes.length === 0) {
        return;
      }
      if (evt.button === 2) {
        if (evt.type === EInputEventType.MOUSEUP) {
          this._idx = this._idx % this._shapes.length;
          let sprite: ISprite = SpriteFactory.createSprite(
            this._shapes[this._idx]
          );
          sprite.x = evt.canvasPosition.x;
          sprite.y = evt.canvasPosition.y;
          if (sprite.shape.type !== "Scale9Grid") {
            sprite.rotation = Math2D.random(-180, 180);
          }
          sprite.renderType = ERenderType.FILL;
          if (this._shapes[this._idx].type === "Line") {
            sprite.renderType = ERenderType.STROKE;
            sprite.scaleX = Math2D.random(1, 2);
            sprite.strokeStyle =
              Canvas2DUtil.Colors[
                Math.floor(Math2D.random(3, Canvas2DUtil.Colors.length - 1))
              ];
          } else {
            sprite.fillStyle =
              Canvas2DUtil.Colors[
                Math.floor(Math2D.random(3, Canvas2DUtil.Colors.length - 1))
              ];
            if (this._shapes[this._idx].type === "Circle") {
              let scale: number = Math2D.random(1, 3);
              sprite.scaleX = scale;
              sprite.scaleY = scale;
            } else if (this._shapes[this._idx].type !== "Scale9Grid") {
              sprite.scaleX = Math2D.random(1, 1.5);
              sprite.scaleY = Math2D.random(1, 1.5);
            }
          }
          sprite.mouseEvent = this.mouseEventHandler.bind(this);
          sprite.updateEvent = this.updateEventHandler.bind(this);
          this._app.rootContainer.addSprite(sprite);
          this._idx++;
        }
      }
    };
  }

  private _createShapes(): void {
    this._shapes = [];
    this._shapes.push(
      SpriteFactory.createLine(vec2.create(0, 0), vec2.create(100, 0))
    );
    this._shapes.push(SpriteFactory.createXLine(100, 0.5));
    this._shapes.push(SpriteFactory.createRect(10, 10));
    this._shapes.push(SpriteFactory.createRect(10, 10, 0.5, 0.5));
    this._shapes.push(SpriteFactory.createRect(10, 10, 0.5, 0));
    this._shapes.push(SpriteFactory.createRect(10, 10, 0, 0.5));
    this._shapes.push(SpriteFactory.createRect(10, 10, -0.5, 0.5));
    this._shapes.push(SpriteFactory.createCircle(10));
    this._shapes.push(SpriteFactory.createEllipse(10, 15));

    let triPoints: vec2[] = [
      vec2.create(0, 0),
      vec2.create(20, 0),
      vec2.create(20, 20),
    ];
    this._shapes.push(SpriteFactory.createPolygon(triPoints));

    let polyPoints: vec2[] = [
      vec2.create(20, 0),
      vec2.create(10, 20),
      vec2.create(-10, 20),
      vec2.create(-20, 0),
      vec2.create(-10, -20),
      vec2.create(10, -20),
    ];
    this._shapes.push(SpriteFactory.createPolygon(polyPoints));
    let data: Scale9Data = new Scale9Data(
      this._image,
      new Inset(30, 30, 30, 30)
    );
    this._shapes.push(SpriteFactory.createScale9Grid(data, 300, 100, 0.5, 0.5));
    /*
       let points2 : vec2 [ ] = [
        vec2 . create ( - 100 , - 100 ) ,
        vec2 . create ( 0 , - 100.00 ) ,
        vec2 . create ( 100 , - 100 ) ,
        vec2 . create ( 0 , 100 ) ,
       ] ;

       this . _shapes . push ( SpriteFactory . createPolygon ( points2 ) ) ;
       */

      
  }

  private mouseEventHandler(s: ISprite, evt: CanvasMouseEvent): void {
    if (evt.button === 0) {
      if (evt.type === EInputEventType.MOUSEDOWN) {
        if (s.shape.type === "Line") {
          this._lastColor = s.strokeStyle;
          s.strokeStyle = "red";
          s.lineWidth = 10;
        } else {
          this._lastColor = s.fillStyle;
          s.fillStyle = "red";
        }
      } else if (evt.type === EInputEventType.MOUSEUP) {
        if (s.shape.type === "Line") {
          s.lineWidth = 1;
          s.strokeStyle = this._lastColor;
        } else {
          s.fillStyle = this._lastColor;
        }
      } else if (evt.type === EInputEventType.MOUSEDRAG) {
        s.x = evt.canvasPosition.x;
        s.y = evt.canvasPosition.y;
      }
    }
  }

  private updateEventHandler(
    s: ISprite,
    mesc: number,
    diffSec: number,
    order: EOrder
  ): void {
    if (order === EOrder.POSTORDER) {
      return;
    }

    if (
      s.shape.type !== "Circle" &&
      s.shape.type !== "Line" &&
      s.shape.type !== "Scale9Grid"
    ) {
      s.rotation += 100 * diffSec;
      console.log("up");
    }
  }
}

// let canvas: HTMLCanvasElement | null = document.getElementById(
//   "canvas"
// ) as HTMLCanvasElement;
// let app: Sprite2DApplication = new Sprite2DApplication(canvas);
// new IShape_Event_Hittest_Draw_Test_Demo(app);
