import Math2D from "./math2d";
import Size from "./size";
import vec2 from "./vec2";

export default class Rectangle {
  public origin: vec2;
  public size: Size;

  public constructor(orign: vec2 = new vec2(), size: Size = new Size(1, 1)) {
    this.origin = orign;
    this.size = size;
  }

  public isEmpty(): boolean {
    let area: number = this.size.width * this.size.height;
    if (Math2D.isEquals(area, 0) === true) {
      return true;
    } else {
      return false;
    }
  }

  public static create(
    x: number = 0,
    y: number = 0,
    w: number = 1,
    h: number = 1
  ): Rectangle {
    let origin: vec2 = new vec2(x, y);
    let size: Size = new Size(w, h);
    return new Rectangle(origin, size);
  }
}
