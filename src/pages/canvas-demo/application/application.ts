import {
  CanvasKeyBoardEvent,
  CanvasMouseEvent,
  EInputEventType,
} from "./event";
import Vec2 from "./math/vec2";

export class Application implements EventListenerObject {
  // public timers: Timer[] = [];

  // private _timeId: number = -1;

  private _fps: number = 0;

  public canvas: HTMLCanvasElement;

  public isSupportMouseMove: boolean;
  protected _isMouseDown: boolean;

  protected _start: boolean = false;
  protected _requestId: number = -1;

  protected _lastTime!: number;
  protected _startTime!: number;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.addEventListener("mousedown", this, false);
    this.canvas.addEventListener("mouseup", this, false);
    this.canvas.addEventListener("mousemove", this, false);
    window.addEventListener("keydown", this, false);
    window.addEventListener("keyup", this, false);
    window.addEventListener("keypress", this, false);
    this._isMouseDown = false;
    this.isSupportMouseMove = false;
  }

  public isRunning(): boolean {
    return this._start;
  }

  public get fps() {
    return this._fps;
  }

  public start(): void {
    if (!this._start) {
      this._start = true;
      this._lastTime = -1;
      this._startTime = -1;
      this._requestId = requestAnimationFrame((msec: number): void => {
        this.step(msec);
      });
    }
  }

  protected step(timeStamp: number): void {
    if (this._startTime === -1) this._startTime = timeStamp;
    if (this._lastTime === -1) this._lastTime = timeStamp;
    let elapsedMsec = timeStamp - this._startTime;
    let intervalSec = timeStamp - this._lastTime;
    if (intervalSec !== 0) {
      this._fps = 1000.0 / intervalSec;
    }
    intervalSec /= 1000.0;
    this._lastTime = timeStamp;
    // this._handleTimers(intervalSec);
    this.update(elapsedMsec, intervalSec);
    this.render();

    requestAnimationFrame(this.step.bind(this));
  }

  public stop(): void {
    if (this._start) {
      window.cancelAnimationFrame(this._requestId);
      this._requestId = -1;
      this._lastTime = -1;
      this._startTime = -1;
      this._start = false;
    }
  }

  public update(elapsedMsec: number, intervalSec: number): void {}
  public render(): void {}
  public handleEvent(evt: Event): void {
    switch (evt.type) {
      case "mousedown":
        this._isMouseDown = true;
        this.dispatchMouseDown(
          this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDOWN)
        );
        break;
      case "mouseup":
        this._isMouseDown = false;
        this.dispatchMouseUp(
          this._toCanvasMouseEvent(evt, EInputEventType.MOUSEUP)
        );
        break;
      case "mousemove":
        if (this.isSupportMouseMove) {
          this.dispatchMouseMove(
            this._toCanvasMouseEvent(evt, EInputEventType.MOUSEMOVE)
          );
        }
        if (this._isMouseDown) {
          this.dispatchMouseDrag(
            this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDRAG)
          );
        }
        break;
      case "keypress":
        this.dispatchKeyPress(
          this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYPRESS)
        );
        break;
      case "keydown":
        this.dispatchKeyDown(
          this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYDOWN)
        );
        break;
      case "keyup":
        this.dispatchKeyUp(
          this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYUP)
        );
        break;
    }
  }

  protected dispatchMouseDown(evt: CanvasMouseEvent): void {
    return;
  }

  protected dispatchMouseUp(evt: CanvasMouseEvent): void {
    return;
  }

  protected dispatchMouseMove(evt: CanvasMouseEvent): void {
    return;
  }

  protected dispatchMouseDrag(evt: CanvasMouseEvent): void {
    return;
  }

  protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
    return;
  }

  protected dispatchKeyUp(evt: CanvasKeyBoardEvent): void {
    return;
  }

  protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {
    return;
  }

  private _viewportToCanvasCoordinate(evt: MouseEvent): Vec2 {
    if (this.canvas) {
      let rect: DOMRect = this.canvas.getBoundingClientRect();
      if (evt.type === "mousedown") {
        console.log(" boundingClientRect : " + JSON.stringify(rect));
        console.log(" clientX : " + evt.clientX + " clientY : " + evt.clientY);
      }
      if (evt.target) {
        let borderLeftWidth: number = 0;
        let borderTopWidth: number = 0;
        let paddingLeft: number = 0;
        let paddingTop: number = 0;
        let decl: CSSStyleDeclaration = window.getComputedStyle(
          evt.target as HTMLElement
        );
        let strNumber: string | null = decl.borderLeftWidth;

        if (strNumber !== null) {
          borderLeftWidth = parseInt(strNumber, 10);
        }

        if (strNumber !== null) {
          borderTopWidth = parseInt(strNumber, 10);
        }

        strNumber = decl.paddingLeft;
        if (strNumber !== null) {
          paddingLeft = parseInt(strNumber, 10);
        }

        strNumber = decl.paddingTop;
        if (strNumber !== null) {
          paddingTop = parseInt(strNumber, 10);
        }

        let x: number = evt.clientX - rect.left - borderLeftWidth - paddingLeft;
        let y: number = evt.clientY - rect.top - borderTopWidth - paddingTop;

        let pos: Vec2 = Vec2.create(x, y);

        if (evt.type === "mousedown") {
          console.log(
            " borderLeftWidth : " +
              borderLeftWidth +
              " borderTopWidth : " +
              borderTopWidth
          );
          console.log(
            " paddingLeft : " + paddingLeft + " paddingTop : " + paddingTop
          );
          console.log(" 变换后的canvasPosition : " + pos.toString());
        }

        return pos;
      }

      alert("canvas为null");
      throw new Error("canvas为null");
    }

    alert("evt . target为null");
    throw new Error("evt . target为null");
  }

  private _toCanvasMouseEvent(
    evt: Event,
    type: EInputEventType
  ): CanvasMouseEvent {
    let event: MouseEvent = evt as MouseEvent;
    let mousePosition: Vec2 = this._viewportToCanvasCoordinate(event);
    let canvasMouseEvent: CanvasMouseEvent = new CanvasMouseEvent(
      type,
      mousePosition,
      event.button,
      event.altKey,
      event.ctrlKey,
      event.shiftKey
    );
    return canvasMouseEvent;
  }

  private _toCanvasKeyBoardEvent(
    evt: Event,
    type: EInputEventType
  ): CanvasKeyBoardEvent {
    let event: KeyboardEvent = evt as KeyboardEvent;
    let canvasKeyboardEvent: CanvasKeyBoardEvent = new CanvasKeyBoardEvent(
      type,
      event.key,
      event.keyCode,
      event.repeat,
      event.altKey,
      event.ctrlKey,
      event.shiftKey
    );
    return canvasKeyboardEvent;
  }

  // public addTimer(
  //   callback: FileCallback,
  //   timeout: number = 1.0,
  //   onlyOnce: boolean = false,
  //   data: any = undefined
  // ): number {
  //   let timer: Timer;
  //   let found: boolean = false;
  //   for (let i = 0; i < this.timers.length; i++) {
  //     let timer: Timer = this.timers[i];
  //     if (timer.enabled === false) {
  //       timer.callback = callback;
  //       timer.callbackData = data;
  //       timer.timeout = timeout;
  //       timer.countdown = timeout;
  //       timer.enabled = true;
  //       timer.onlyOnce = onlyOnce;
  //       return timer.id;
  //     }
  //   }

  // }

  // public removeTimer(id: number): boolean {
  //   let found: boolean = false;
  //   for (let i = 0; i < this.timers.length; i++) {
  //     if (this.timers[i].id === id) {
  //       let timer: Timer = this.timers[i];
  //       timer.enabled = false;
  //       found = true;
  //       break;
  //     }
  //   }
  //   return found;
  // }

  // private _handleTimers(intervalSec: number): void {
  //   for (let i = 0; i < this.timers.length; i++) {
  //     let timer: Timer = this.timers[i];
  //     if (timer.enabled === false) {
  //       continue;
  //     }
  //     timer.countdown -= intervalSec;
  //     if (timer.countdown < 0.0) {
  //       timer.callback(timer.id, timer.callbackData);
  //       if (timer.onlyOnce === false) {
  //         timer.countdown = timer.timeout;
  //       } else {
  //         this.removeTimer(timer.id);
  //       }
  //     }
  //   }
  // }
}

export class Canvas2DApplication extends Application {
  public context2D: CanvasRenderingContext2D | null;
  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.context2D = this.canvas.getContext("2d");
  }
  public clearRect() {
    const { canvas, context2D } = this;
    context2D?.clearRect(0, 0, canvas.width, canvas.height);
  }
}
