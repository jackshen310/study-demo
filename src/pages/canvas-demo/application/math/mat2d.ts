import vec2 from "./vec2";
import Math2D from "./math2d";

const PiBy180 = Math.PI / 180;
export default class mat2d {
  public values: Float32Array;

  public constructor(
    a: number = 1,
    b: number = 0,
    c: number = 0,
    d: number = 1,
    x: number = 0,
    y: number = 0
  ) {
    this.values = new Float32Array([a, b, c, d, x, y]);
  }

  public identity(): void {
    this.values[0] = 1.0;
    this.values[1] = 0.0;
    this.values[2] = 0.0;
    this.values[3] = 1.0;
    this.values[4] = 0.0;
    this.values[5] = 0.0;
  }

  public static create(
    a: number = 1,
    b: number = 0,
    c: number = 0,
    d: number = 1,
    x: number = 0,
    y: number = 0
  ): mat2d {
    return new mat2d(a, b, c, d, x, y);
  }

  public get xAxis(): vec2 {
    return vec2.create(this.values[0], this.values[1]);
  }

  public get yAxis(): vec2 {
    return vec2.create(this.values[2], this.values[3]);
  }

  public get origin(): vec2 {
    return vec2.create(this.values[4], this.values[5]);
  }

  public getAngle(isRadian: boolean = false): number {
    let angle: number = Math.atan2(this.values[1], this.values[0]);
    if (isRadian) {
      return angle;
    }
    return angle / PiBy180;
  }

  public static copy(src: mat2d, result: mat2d | null = null): mat2d {
    if (result === null) result = new mat2d();
    result.values[0] = src.values[0];
    result.values[1] = src.values[1];
    result.values[2] = src.values[2];
    result.values[3] = src.values[3];
    result.values[4] = src.values[4];
    result.values[5] = src.values[5];
    return result;
  }
  /**
   * 向量相乘
   * @param left
   * @param right
   * @param result
   * @returns
   */
  public static multiply(
    left: mat2d,
    right: mat2d,
    result: mat2d | null = null
  ): mat2d {
    if (result === null) result = new mat2d();

    let a0: number = left.values[0];
    let a1: number = left.values[1];
    let a2: number = left.values[2];
    let a3: number = left.values[3];
    let a4: number = left.values[4];
    let a5: number = left.values[5];

    let b0: number = right.values[0];
    let b1: number = right.values[1];
    let b2: number = right.values[2];
    let b3: number = right.values[3];
    let b4: number = right.values[4];
    let b5: number = right.values[5];

    result.values[0] = a0 * b0 + a2 * b1;
    result.values[1] = a1 * b0 + a3 * b1;
    result.values[2] = a0 * b2 + a2 * b3;
    result.values[3] = a1 * b2 + a3 * b3;
    result.values[4] = a0 * b4 + a2 * b5 + a4;
    result.values[5] = a1 * b4 + a3 * b5 + a5;

    return result;
  }

  public static determinant(mat: mat2d): number {
    return mat.values[0] * mat.values[3] - mat.values[2] * mat.values[1];
  }
  /**
   * 取反
   * @param src
   * @param result
   * @returns
   */
  public static invert(src: mat2d, result: mat2d): boolean {
    let det: number = mat2d.determinant(src);

    if (Math2D.isEquals(det, 0)) {
      return false;
    }

    det = 1.0 / det;

    result.values[0] = src.values[3] * det;
    result.values[1] = -src.values[1] * det;
    result.values[2] = -src.values[2] * det;
    result.values[3] = src.values[0] * det;
    result.values[4] =
      (src.values[2] * src.values[5] - src.values[3] * src.values[4]) * det;
    result.values[5] =
      (src.values[1] * src.values[4] - src.values[0] * src.values[5]) * det;
    return true;
  }

  public static makeRotation(
    radians: number,
    result: mat2d | null = null
  ): mat2d {
    if (result === null) result = new mat2d();
    let s: number = Math.sin(radians),
      c: number = Math.cos(radians);
    result.values[0] = c;
    result.values[1] = s;
    result.values[2] = -s;
    result.values[3] = c;
    result.values[4] = 0;
    result.values[5] = 0;
    return result;
  }

  public onlyRotationMatrixInvert(): mat2d {
    let s: number = this.values[1];
    this.values[1] = this.values[2];
    this.values[2] = s;
    return this;
  }

  public static makeRotationFromVectors(
    v1: vec2,
    v2: vec2,
    norm: boolean = false,
    result: mat2d | null = null
  ): mat2d {
    if (result === null) result = new mat2d();
    result.values[0] = vec2.cosAngle(v1, v2, norm);
    result.values[1] = vec2.sinAngle(v1, v2, norm);
    result.values[2] = -vec2.sinAngle(v1, v2, norm);
    result.values[3] = vec2.cosAngle(v1, v2, norm);
    result.values[4] = 0;
    result.values[5] = 0;
    return result;
  }

  public static makeReflection(axis: vec2, result: mat2d | null = null): mat2d {
    if (result === null) result = new mat2d();
    result.values[0] = 1 - 2 * axis.x * axis.x;
    result.values[1] = -2 * axis.x * axis.y;
    result.values[2] = -2 * axis.x * axis.y;
    result.values[3] = 1 - 2 * axis.y * axis.y;
    result.values[4] = 0;
    result.values[5] = 0;
    return result;
  }

  public static makeXSkew(sx: number, result: mat2d | null = null): mat2d {
    if (result === null) result = new mat2d();
    result.values[0] = 1;
    result.values[1] = 0;
    result.values[2] = sx;
    result.values[3] = 1;
    result.values[4] = 0;
    result.values[5] = 0;
    return result;
  }

  public static makeYSkew(sy: number, result: mat2d | null = null): mat2d {
    if (result === null) result = new mat2d();
    result.values[0] = 1;
    result.values[1] = sy;
    result.values[2] = 0;
    result.values[3] = 1;
    result.values[4] = 0;
    result.values[5] = 0;
    return result;
  }

  public static makeTranslation(
    tx: number,
    ty: number,
    result: mat2d | null = null
  ): mat2d {
    if (result === null) result = new mat2d();
    result.values[0] = 1;
    result.values[1] = 0;
    result.values[2] = 0;
    result.values[3] = 1;

    result.values[4] = tx;
    result.values[5] = ty;
    return result;
  }

  public static makeScale(
    sx: number,
    sy: number,
    result: mat2d | null = null
  ): mat2d {
    if (Math2D.isEquals(sx, 0) || Math2D.isEquals(sy, 0)) {
      alert(" x轴或y轴缩放系数为0 ");
      throw new Error(" x轴或y轴缩放系数为0 ");
    }

    if (result === null) result = new mat2d();
    result.values[0] = sx;
    result.values[1] = 0;
    result.values[2] = 0;
    result.values[3] = sy;
    result.values[4] = 0;
    result.values[5] = 0;
    return result;
  }

  public static temp1 = mat2d.create();
  public static temp2 = mat2d.create();
  public static quadBezierBasicMatrix = mat2d.create(1, -2, -2, 2, 1, 0);
}
