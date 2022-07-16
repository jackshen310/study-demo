export default class Size {
  public values: Float32Array;

  public constructor(w: number = 1, h: number = 1) {
    this.values = new Float32Array([w, h]);
  }

  set width(value: number) {
    this.values[0] = value;
  }
  get width(): number {
    return this.values[0];
  }

  set height(value: number) {
    this.values[1] = value;
  }
  get height(): number {
    return this.values[1];
  }

  public static create(w: number = 1, h: number = 1): Size {
    return new Size(w, h);
  }
}
