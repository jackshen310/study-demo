import Math2D from "./math2d";

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

  public add(right: Vec2): Vec2 {
    Vec2.sum(this, right, this);
    return this;
  }
  /**
   * 向量相加，{x1,y1} + {x2,y2} = {x1+x2, y1+y2}
   * @param left
   * @param right
   * @param result
   * @returns
   */
  public static sum(left: Vec2, right: Vec2, result: Vec2 | null = null): Vec2 {
    if (result === null) result = new Vec2();
    result.values[0] = left.values[0] + right.values[0];
    result.values[1] = left.values[1] + right.values[1];
    return result;
  }
  /**
   * 向量相减
   * @param another
   * @returns
   */
  public substract(another: Vec2): Vec2 {
    Vec2.difference(this, another, this);
    return this;
  }
  /**
   * 向量相减，{x1,y1} - {x2,y2} = {x1-x2, y1-y2}
   * @param end
   * @param start
   * @param result
   * @returns
   */
  public static difference(
    end: Vec2,
    start: Vec2,
    result: Vec2 | null = null
  ): Vec2 {
    if (result === null) result = new Vec2();
    result.values[0] = end.values[0] - start.values[0];
    result.values[1] = end.values[1] - start.values[1];
    return result;
  }

  public static copy(src: Vec2, result: Vec2 | null = null): Vec2 {
    if (result === null) result = new Vec2();
    result.values[0] = src.values[0];
    result.values[1] = src.values[1];
    return result;
  }
  /**
   * 向量缩放，{x,y} * scale = {x*scale, y*scale}
   * @param direction
   * @param scalar
   * @param result
   * @returns
   */
  public static scale(
    direction: Vec2,
    scalar: number,
    result: Vec2 | null = null
  ): Vec2 {
    if (result === null) result = new Vec2();
    result.values[0] = direction.values[0] * scalar;
    result.values[1] = direction.values[1] * scalar;
    return result;
  }

  public static scaleAdd(
    start: Vec2,
    direction: Vec2,
    scalar: number,
    result: Vec2 | null = null
  ): Vec2 {
    if (result === null) result = new Vec2();
    Vec2.scale(direction, scalar, result);
    return Vec2.sum(start, result, result);
  }

  public static moveTowards(
    start: Vec2,
    direction: Vec2,
    scalar: number,
    result: Vec2 | null = null
  ): Vec2 {
    if (result === null) result = new Vec2();
    Vec2.scale(direction, scalar, result);
    return Vec2.sum(start, result, result);
  }

  public innerProduct(right: Vec2): number {
    return Vec2.dotProduct(this, right);
  }

  public static dotProduct(left: Vec2, right: Vec2): number {
    return left.values[0] * right.values[0] + left.values[1] * right.values[1];
  }
  /**
   * 两个向量的叉乘,返回标量
   * @param left
   * @param right
   * @returns
   */
  public static crossProduct(left: Vec2, right: Vec2): number {
    return left.x * right.y - left.y * right.x;
  }
  // 计算两个向量的连起来与x轴的夹角
  public static getOrientation(
    from: Vec2,
    to: Vec2,
    isRadian: boolean = false
  ): number {
    let diff: Vec2 = Vec2.difference(to, from);
    let radian = Math.atan2(diff.y, diff.x);
    if (isRadian === false) {
      radian = Math2D.toDegree(radian);
    }
    return radian;
  }
  // 根据公式：cosθ = a·b / ( || a || || b || )，计算向量a和向量b的夹角
  public static getAngle(a: Vec2, b: Vec2, isRadian: boolean = false): number {
    let dot: number = Vec2.dotProduct(a, b);
    let radian: number = Math.acos(dot / (a.length * b.length));
    if (isRadian === false) {
      radian = Math2D.toDegree(radian);
    }
    return radian;
  }

  public static cosAngle(a: Vec2, b: Vec2, norm: boolean = false): number {
    if (norm === true) {
      a.normalize();
      b.normalize();
    }
    return Vec2.dotProduct(a, b);
  }

  public static sinAngle(a: Vec2, b: Vec2, norm: boolean = false): number {
    if (norm === true) {
      a.normalize();
      b.normalize();
    }
    return a.x * b.y - b.x * a.y;
  }
  public get squaredLength(): number {
    let x = this.values[0];
    let y = this.values[1];
    return x * x + y * y;
  }

  public get length(): number {
    return Math.sqrt(this.squaredLength);
  }
  public normalize(): number {
    let len: number = this.length;
    if (Math2D.isEquals(len, 0)) {
      console.log(" the length = 0 ");
      this.values[0] = 0;
      this.values[1] = 0;
      return 0;
    }

    if (Math2D.isEquals(len, 1)) {
      console.log(" the length = 1 ");
      return 1.0;
    }

    this.values[0] /= len;
    this.values[1] /= len;
    return len;
  }

  public static zero = new Vec2(0, 0);
  public static xAxis = new Vec2(1, 0);
  public static yAxis = new Vec2(0, 1);
  public static nXAxis = new Vec2(-1, 0);
  public static nYAxis = new Vec2(0, -1);
  public static temp = new Vec2(0, 0);
  public static temp1 = new Vec2(0, 0);
}
