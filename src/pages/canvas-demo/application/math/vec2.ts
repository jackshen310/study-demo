export default class Vec2 {
  public values: Float32Array;

  public constructor(x: number = 0, y: number = 0) {
    this.values = new Float32Array([x, y]);
  }

  public toString(): string {
    return " [ " + this.values[0] + " , " + this.values[1] + " ] ";
  }

  get x(): number {
    return this.values[0];
  }
  set x(x: number) {
    this.values[0] = x;
  }

  get y(): number {
    return this.values[1];
  }
  set y(y: number) {
    this.values[1] = y;
  }

  public reset(x: number = 0, y: number): Vec2 {
    this.values[0] = x;
    this.values[1] = y;
    return this;
  }

  public static create(x: number = 0, y: number = 0): Vec2 {
    return new Vec2(x, y);
  }
}
