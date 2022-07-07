export default class Inset {
  public values: Float32Array;

  public constructor(
    l: number = 0,
    t: number = 0,
    r: number = 0,
    b: number = 0
  ) {
    this.values = new Float32Array([l, t, r, b]);
  }

  public get leftMargin(): number {
    return this.values[0];
  }

  public set leftMargin(value: number) {
    this.values[0] = value;
  }

  public get topMargin(): number {
    return this.values[1];
  }

  public set topMargin(value: number) {
    this.values[1] = value;
  }

  public get rightMargin(): number {
    return this.values[2];
  }

  public set rightMargin(value: number) {
    this.values[2] = value;
  }

  public get bottomMargin(): number {
    return this.values[3];
  }

  public set bottomMargin(value: number) {
    this.values[3] = value;
  }
}
