import Vec2 from "../math/vec2";

export enum EInputEventType {
  MOUSEEVENT,
  MOUSEDOWN,
  MOUSEUP,
  MOUSEMOVE,
  MOUSEDRAG,
  KEYBOARDEVENT,
  KEYUP,
  KEYDOWN,
  KEYPRESS,
}
/**
 * 键盘事件
 */
export class CanvasInputEvent {
  public altKey: boolean;
  public ctrlKey: boolean;
  public shiftKey: boolean;
  public type: EInputEventType;
  public constructor(
    type: EInputEventType,
    altKey: boolean = false,
    ctrlKey: boolean = false,
    shiftKey: boolean = false
  ) {
    this.altKey = altKey;
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
    this.type = type;
  }
}
/**
 * 鼠标事件
 */
export class CanvasMouseEvent extends CanvasInputEvent {
  public button: number;
  // 基于画布的坐标
  public canvasPosition: Vec2;
  // 基于浏览器视窗的坐标
  public localPosition: Vec2;
  public hasLocalPosition: boolean;

  public constructor(
    type: EInputEventType,
    canvasPos: Vec2,
    button: number,
    altKey: boolean = false,
    ctrlKey: boolean = false,
    shiftKey: boolean = false
  ) {
    super(type, altKey, ctrlKey, shiftKey);
    this.canvasPosition = canvasPos;
    this.button = button;
    this.hasLocalPosition = false;
    this.localPosition = Vec2.create();
  }
}

export class CanvasKeyBoardEvent extends CanvasInputEvent {
  public key: string;
  public keyCode: number;
  public repeat: boolean;

  public constructor(
    type: EInputEventType,
    key: string,
    keyCode: number,
    repeat: boolean,
    altKey: boolean = false,
    ctrlKey: boolean = false,
    shiftKey: boolean = false
  ) {
    super(type, altKey, ctrlKey, shiftKey);
    this.key = key;
    this.keyCode = keyCode;
    this.repeat = repeat;
  }
}
