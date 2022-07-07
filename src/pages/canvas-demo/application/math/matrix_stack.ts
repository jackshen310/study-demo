import mat2d from "./mat2d";
import Math2D from "./math2d";
import vec2 from "./vec2";

export default class MatrixStack {
  private _mats: mat2d[];
  public constructor() {
    this._mats = [];
    this._mats.push(new mat2d());
  }

  public get matrix(): mat2d {
    if (this._mats.length === 0) {
      alert(" 矩阵堆栈为空 ");
      throw new Error(" 矩阵堆栈为空 ");
    }

    return this._mats[this._mats.length - 1];
  }

  public pushMatrix(): void {
    let mat: mat2d = mat2d.copy(this.matrix);
    this._mats.push(mat);
  }

  public popMatrix(): void {
    if (this._mats.length === 0) {
      alert(" 矩阵堆栈为空 ");
      return;
    }
    this._mats.pop();
  }

  public loadIdentity(): void {
    this.matrix.identity();
  }

  public loadMatrix(mat: mat2d): void {
    mat2d.copy(mat, this.matrix);
  }

  public multMatrix(mat: mat2d): void {
    mat2d.multiply(this.matrix, mat, this.matrix);
  }

  public translate(x: number = 0, y: number = 0): void {
    let mat: mat2d = mat2d.makeTranslation(x, y);
    this.multMatrix(mat);
  }

  public rotate(degree: number = 0, isRadian: boolean = false): void {
    if (isRadian === false) {
      degree = Math2D.toRadian(degree);
    }
    let mat: mat2d = mat2d.makeRotation(degree);
    this.multMatrix(mat);
  }

  public rotateFrom(v1: vec2, v2: vec2, norm: boolean = false): void {
    let mat: mat2d = mat2d.makeRotationFromVectors(v1, v2, norm);
    this.multMatrix(mat);
  }

  public scale(x: number = 1.0, y: number = 1.0): void {
    let mat: mat2d = mat2d.makeScale(x, y);
    this.multMatrix(mat);
  }

  public invert(): mat2d {
    let ret: mat2d = new mat2d();
    if (mat2d.invert(this.matrix, ret) === false) {
      alert(" 堆栈顶部矩阵为奇异矩阵，无法求逆 ");
      throw new Error(" 堆栈顶部矩阵为奇异矩阵，无法求逆 ");
    }
    return ret;
  }
}
