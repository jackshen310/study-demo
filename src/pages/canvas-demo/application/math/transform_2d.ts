import mat2d from "./mat2d";
import Math2D from "./math2d";
import vec2 from "./vec2";

export class Transform2D {
  public position: vec2;
  public rotation: number;
  public scale: vec2;

  public constructor(
    x: number = 0,
    y: number = 0,
    rotation: number = 0,
    scaleX: number = 1,
    scaleY: number = 1
  ) {
    this.position = new vec2(x, y);
    this.rotation = rotation;
    this.scale = new vec2(scaleX, scaleY);
  }

  public toMatrix(): mat2d {
    Math2D.matStack.loadIdentity();
    Math2D.matStack.translate(this.position.x, this.position.y);
    Math2D.matStack.rotate(this.rotation, false);
    Math2D.matStack.scale(this.scale.x, this.scale.y);
    return Math2D.matStack.matrix;
  }

  public toInvMatrix(result: mat2d): boolean {
    let mat: mat2d = this.toMatrix();
    return mat2d.invert(mat, result);
  }
}
