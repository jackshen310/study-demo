import mat2d from "./mat2d";
import MatrixStack from "./matrix_stack";
import vec2 from "./vec2";

const PiBy180 = Math.PI / 180;
const EPSILON: number = 0.00001;

export default class Math2D {
  /**
   * 角度 to 弧度
   * @param degree
   * @returns
   */
  public static toRadian(degree: number): number {
    return degree * PiBy180;
  }
  /**
   * 弧度 to 角度
   * @param radian
   * @returns
   */
  public static toDegree(radian: number): number {
    return radian / PiBy180;
  }
  /**
   * 生成[from,to]范围内的随机数
   * @param from
   * @param to
   * @returns
   */
  public static random(from: number, to: number): number {
    return Math.random() * to + from;
  }

  public static angleSubtract(from: number, to: number): number {
    let diff: number = to - from;
    while (diff > 180) {
      diff -= 360;
    }

    while (diff < -180) {
      diff += 360;
    }

    return diff;
  }

  public static isEquals(
    left: number,
    right: number,
    espilon: number = EPSILON
  ): boolean {
    if (Math.abs(left - right) >= EPSILON) {
      return false;
    }
    return true;
  }

  public static getQuadraticBezierPosition(
    start: number,
    ctrl: number,
    end: number,
    t: number
  ): number {
    if (t < 0.0 || t > 1.0) {
      alert(" t的取值范围必须为[ 0 , 1 ] ");
      throw new Error(" t的取值范围必须为[ 0 , 1 ] ");
    }
    let t1: number = 1.0 - t;
    let t2: number = t1 * t1;
    return t2 * start + 2.0 * t * t1 * ctrl + t * t * end;
  }

  public static getQuadraticBezierVector(
    start: vec2,
    ctrl: vec2,
    end: vec2,
    t: number,
    result: vec2 | null = null
  ): vec2 {
    if (result === null) result = vec2.create();
    result.x = Math2D.getQuadraticBezierPosition(start.x, ctrl.x, end.x, t);
    result.y = Math2D.getQuadraticBezierPosition(start.y, ctrl.y, end.y, t);
    return result;
  }

  public static getQuadraticBezierMat(
    start: vec2,
    ctrl: vec2,
    end: vec2,
    t: number,
    result: vec2 | null = null
  ): vec2 {
    if (result === null) result = vec2.create();

    return result;
  }

  public static getCubicBezierPosition(
    start: number,
    ctrl0: number,
    ctrl1: number,
    end: number,
    t: number
  ): number {
    if (t < 0.0 || t > 1.0) {
      alert(" t的取值范围必须为[ 0 , 1 ] ");
      throw new Error(" t的取值范围必须为[ 0 , 1 ] ");
    }
    let t1: number = 1.0 - t;
    let t2: number = t * t;
    let t3: number = t2 * t;
    return (
      t1 * t1 * t1 * start +
      3 * t * (t1 * t1) * ctrl0 +
      3 * t2 * t1 * ctrl1 +
      t3 * end
    );
  }

  public static getCubicBezierVector(
    start: vec2,
    ctrl0: vec2,
    ctrl1: vec2,
    end: vec2,
    t: number,
    result: vec2 | null = null
  ): vec2 {
    if (result === null) result = vec2.create();
    result.x = Math2D.getCubicBezierPosition(
      start.x,
      ctrl0.x,
      ctrl1.x,
      end.x,
      t
    );
    result.y = Math2D.getCubicBezierPosition(
      start.y,
      ctrl0.y,
      ctrl1.y,
      end.y,
      t
    );
    return result;
  }

  //   public static createQuadraticBezierEnumerator(
  //     start: vec2,
  //     ctrl: vec2,
  //     end: vec2,
  //     steps: number = 30
  //   ): IBezierEnumerator {
  //     return new BezierEnumerator(start, end, ctrl, null, steps);
  //   }

  //   public static createCubicBezierEnumerator(
  //     start: vec2,
  //     ctrl0: vec2,
  //     ctrl1: vec2,
  //     end: vec2,
  //     steps: number = 30
  //   ): IBezierEnumerator {
  //     return new BezierEnumerator(start, end, ctrl0, ctrl1, steps);
  //   }

  /**
   * 判断点是否在线上
   * @param pt
   * @param start
   * @param end
   * @param closePoint
   * @returns
   */
  public static projectPointOnLineSegment(
    pt: vec2,
    start: vec2,
    end: vec2,
    closePoint: vec2
  ): boolean {
    let v0: vec2 = vec2.create();
    let v1: vec2 = vec2.create();
    let d: number = 0;

    vec2.difference(pt, start, v0);
    vec2.difference(end, start, v1);
    d = v1.normalize();

    let t: number = vec2.dotProduct(v0, v1);
    if (t < 0) {
      closePoint.x = start.x;
      closePoint.y = start.y;
      return false;
    } else if (t > d) {
      closePoint.x = end.x;
      closePoint.y = end.y;
      return false;
    } else {
      vec2.scaleAdd(start, v1, t, closePoint);
      return true;
    }
  }
  /**
   * 判断坐标是否在线附近
   * @param pt
   * @param start
   * @param end
   * @param radius
   * @returns
   */
  public static isPointOnLineSegment(
    pt: vec2,
    start: vec2,
    end: vec2,
    radius: number = 2
  ): boolean {
    let closePt: vec2 = vec2.create();
    if (Math2D.projectPointOnLineSegment(pt, start, end, closePt) === false) {
      return false;
    }
    return Math2D.isPointInCircle(pt, closePt, radius);
  }
  /**
   * 判断坐标是否在圆内部
   * @param pt
   * @param center
   * @param radius
   * @returns
   */
  public static isPointInCircle(
    pt: vec2,
    center: vec2,
    radius: number
  ): boolean {
    let diff: vec2 = vec2.difference(pt, center);
    let len2: number = diff.squaredLength;
    if (len2 <= radius * radius) {
      return true;
    }
    return false;
  }
  /**
   * 判断坐标是否在矩形内部
   * @param ptX
   * @param ptY
   * @param x
   * @param y
   * @param w
   * @param h
   * @returns
   */
  public static isPointInRect(
    ptX: number,
    ptY: number,
    x: number,
    y: number,
    w: number,
    h: number
  ): boolean {
    if (ptX >= x && ptX <= x + w && ptY >= y && ptY <= y + h) {
      return true;
    }
    return false;
  }
  /**
   * 判断坐标是否在椭圆内部
   * @param ptX
   * @param ptY
   * @param centerX
   * @param centerY
   * @param radiusX
   * @param radiusY
   * @returns
   */
  public static isPointInEllipse(
    ptX: number,
    ptY: number,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number
  ): boolean {
    let diffX = ptX - centerX;
    let diffY = ptY - centerY;
    let n: number =
      (diffX * diffX) / (radiusX * radiusX) +
      (diffY * diffY) / (radiusY * radiusY);
    return n <= 1.0;
  }

  public static sign(v0: vec2, v1: vec2, v2: vec2): number {
    let e1: vec2 = vec2.difference(v0, v2);
    let e2: vec2 = vec2.difference(v1, v2);
    return vec2.crossProduct(e1, e2);
  }
  /**
   * 判断坐标是否在三角形内部
   * @param pt
   * @param v0
   * @param v1
   * @param v2
   * @returns
   */
  public static isPointInTriangle(pt: vec2, v0: vec2, v1: vec2, v2: vec2) {
    let b1: boolean = Math2D.sign(v0, v1, pt) < 0.0;
    let b2: boolean = Math2D.sign(v1, v2, pt) < 0.0;
    let b3: boolean = Math2D.sign(v2, v0, pt) < 0.0;
    return b1 === b2 && b2 === b3;
  }
  /**
   * 判断坐标是否在多边形内部
   * @param pt
   * @param points
   * @returns
   */
  public static isPointInPolygon(pt: vec2, points: vec2[]): boolean {
    if (points.length < 3) {
      return false;
    }
    for (let i: number = 2; i < points.length; i++) {
      if (Math2D.isPointInTriangle(pt, points[0], points[i - 1], points[i])) {
        return true;
      }
    }
    return false;
  }

  public static isConvex(points: vec2[]): boolean {
    let sign: boolean = Math2D.sign(points[0], points[1], points[2]) < 0;
    let j: number, k: number;
    for (let i: number = 1; i < points.length; i++) {
      j = (i + 1) % points.length;
      k = (i + 2) % points.length;
      if (sign !== Math2D.sign(points[i], points[j], points[k]) < 0) {
        return false;
      }
    }
    return true;
  }

  public static transform(
    mat: mat2d,
    pt: vec2,
    result: vec2 | null = null
  ): vec2 {
    if (result === null) result = vec2.create();
    result.values[0] =
      mat.values[0] * pt.values[0] +
      mat.values[2] * pt.values[1] +
      mat.values[4];
    result.values[1] =
      mat.values[1] * pt.values[0] +
      mat.values[3] * pt.values[1] +
      mat.values[5];
    return result;
  }
  /**
   * 两点的距离
   * @param x0 
   * @param y0 
   * @param x1 
   * @param y1 
   * @returns 
   */
  public distance(x0: number, y0: number, x1: number, y1: number): number {
    let diffX: number = x1 - x0;
    let diffY: number = y1 - y0;
    return Math.sqrt(diffX * diffX + diffY * diffY);
  }

  public static matStack: MatrixStack = new MatrixStack();
}
