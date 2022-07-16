import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./event";
import Math2D from "./math/math2d";
import Editor from "./editor";
import Vec2 from "./math/vec2";
import mat2d from "./math/mat2d";

export default class Tank {
  public width: number = 80;
  public height: number = 50;
  public pos = new Vec2(100, 100);
  public scale = new Vec2(1.0, 1.0);
  public tankRotation = new mat2d();

  public turretRotation: number = 0;
  public initYAxis: boolean = false;

  public showLine: boolean = false;
  public showCoord: boolean = false;

  public gunLength: number = Math.max(this.width, this.height);
  public gunMuzzleRadius: number = 5;

  public target = new Vec2();

  public linearSpeed: number = 100.0;
  public turretRotateSpeed: number = Math2D.toRadian(2);

  public get x() {
    return this.pos.x;
  }
  public set x(x) {
    this.pos.x = x;
  }

  public get y() {
    return this.pos.y;
  }
  public set y(y) {
    this.pos.y = y;
  }

  public get targetX() {
    return this.target.x;
  }
  public set targetX(x) {
    this.target.x = x;
  }

  public get targetY() {
    return this.target.y;
  }
  public set targetY(y) {
    this.target.y = y;
  }

  //   private _lookAt(): void {
  //     // 计算夹角
  //     let diffX: number = this.targetX - this.x;
  //     let diffY: number = this.targetY - this.y;
  //     let radian = Math.atan2(diffY, diffX);
  //     this.tankRotation = radian;
  //   }

  private _lookAt(): void {
    // 坦克与鼠标位置形成的方向变量
    let v = Vec2.difference(this.target, this.pos);
    v.normalize(); // 变为单位矩阵

    // 从v向量到x轴的旋转矩阵
    // this.tankRotation = mat2d.makeRotationFromVectors(v, Vec2.xAxis);
    // // 求逆，从x轴需要旋转xxx才能到v向量
    // this.tankRotation.onlyRotationMatrixInvert(); // 逆旋转矩阵

    // 计算从x轴到v向量的旋转矩阵
    this.tankRotation = mat2d.makeRotationFromVectors(Vec2.xAxis, v);
  }

  //   private _moveTowardTo(intervalSec: number): void {
  //     let diffX: number = this.targetX - this.x;
  //     let diffY: number = this.targetY - this.y;
  //     let currSpeed: number = this.linearSpeed * intervalSec;
  //     console.time("update");
  //     if (diffX * diffX + diffY * diffY > currSpeed * currSpeed) {
  //       this.x = this.x + Math.cos(this.tankRotation) * currSpeed;
  //       this.y = this.y + Math.sin(this.tankRotation) * currSpeed;
  //     }
  //     console.timeEnd("update");
  //   }
  // 用向量计算代替三角函数计算，比三角函数计算的快
  private _moveTowardTo2(intervalSec: number): void {
    let dir = Vec2.difference(this.target, this.pos);
    dir.normalize();
    this.pos = Vec2.scaleAdd(this.pos, dir, this.linearSpeed * intervalSec);
  }

  public update(intervalSec: number): void {
    this._moveTowardTo2(intervalSec);
  }

  public onMouseMove(evt: CanvasMouseEvent): void {
    this.targetX = evt.canvasPosition.x;
    this.targetY = evt.canvasPosition.y;
    this._lookAt();
  }

  public onKeyPress(evt: CanvasKeyBoardEvent): void {
    if (evt.key === "r") {
      this.turretRotation += this.turretRotateSpeed;
    } else if (evt.key === "t") {
      this.turretRotation = 0;
    } else if (evt.key === "e") {
      this.turretRotation -= this.turretRotateSpeed;
    }
  }

  public draw(app: Editor): void {
    if (app.context2D === null) {
      return;
    }
    app.context2D.save();
    app.context2D.translate(this.pos.x, this.pos.y);
    // app.context2D.rotate(this.tankRotation);
    app.transform(this.tankRotation);
    app.context2D.scale(this.scale.x, this.scale.y);
    app.context2D.save();
    app.context2D.fillStyle = "grey";
    app.context2D.beginPath();
    app.context2D.rect(
      -this.width * 0.5,
      -this.height * 0.5,
      this.width,
      this.height
    );
    app.context2D.fill();
    app.context2D.restore();
    // 炮塔+炮管+炮口，共享同一个坐标系
    app.context2D.save();
    app.context2D.rotate(this.turretRotation);
    app.context2D.fillStyle = "red";
    app.context2D.beginPath();
    app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
    app.context2D.fill();

    // 炮管
    app.context2D.strokeStyle = "blue";
    app.context2D.lineWidth = 5;
    app.context2D.lineCap = "round";
    app.context2D.beginPath();
    app.context2D.moveTo(0, 0);
    app.context2D.lineTo(this.gunLength, 0);
    app.context2D.stroke();
    // 炮口
    app.context2D.translate(this.gunLength, 0);
    app.context2D.translate(this.gunMuzzleRadius, 0);
    app.fillCircle(0, 0, 5, "black");
    app.context2D.restore();

    // 圆
    app.context2D.save();
    app.context2D.translate(this.width * 0.5, 0);
    app.fillCircle(0, 0, 10, "green");
    app.context2D.restore();

    // 画坐标系
    if (this.showCoord) {
      app.context2D.save();
      app.context2D.lineWidth = 1;
      app.context2D.lineCap = "butt";
      app.strokeCoord(0, 0, this.width * 1.2, this.height * 1.2);
      app.context2D.restore();
    }
    app.context2D.restore();

    // 中心点到画布中心点直线
    app.context2D.save();
    app.strokeLine(
      this.x,
      this.y,
      app.canvas.width * 0.5,
      app.canvas.height * 0.5
    );
    // 中心点到鼠标点
    app.strokeLine(this.x, this.y, this.targetX, this.targetY);
    app.context2D.restore();
  }
}
