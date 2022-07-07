import { Canvas2DApplication } from "./application";
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./event";
import Vec2 from "./math/vec2";

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
  protected dispatchMouseMove(evt: CanvasMouseEvent): void {
    this.mouse = evt.canvasPosition;
  }
  protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
    console.log(" key : " + evt.key + " is down ");
  }

  protected dispatchMouseDown(evt: CanvasMouseEvent): void {
    console.log(" canvasPosition : " + evt.canvasPosition);
  }

  public update(elapsedMsec: number, intervalSec: number): void {
    console.log(
      " elapsedMsec : " + elapsedMsec + " intervalSec : " + intervalSec
    );
  }

  public render(): void {
    console.log(" 调用render方法 ");
  }
}
