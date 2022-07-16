import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./event";
import Math2D from "./math/math2d";
import Editor from "./editor";

export default class Tank {
  public width: number = 80;
  public height: number = 50;
  public x: number = 100;
  public y: number = 100;
  public scaleX: number = 1.0;
  public scaleY: number = 1.0;
  public tankRotation: number = 0;
  public turretRotation: number = 0;
  public initYAxis: boolean = false;

  public showLine: boolean = false;
  public showCoord: boolean = false;

  public gunLength: number = Math.max(this.width, this.height);
  public gunMuzzleRadius: number = 5;

  public targetX: number = 0;
  public targetY: number = 0;

  public linearSpeed: number = 100.0;
  public turretRotateSpeed: number = Math2D.toRadian(2);

  private _lookAt(): void {
    // 计算夹角
    let diffX: number = this.targetX - this.x;
    let diffY: number = this.targetY - this.y;
    let radian = Math.atan2(diffY, diffX);
    this.tankRotation = radian;
  }

  private _moveTowardTo(intervalSec: number): void {
    let diffX: number = this.targetX - this.x;
    let diffY: number = this.targetY - this.y;
    let currSpeed: number = this.linearSpeed * intervalSec;
    if (diffX * diffX + diffY * diffY > currSpeed * currSpeed) {
      this.x = this.x + Math.cos(this.tankRotation) * currSpeed;
      this.y = this.y + Math.sin(this.tankRotation) * currSpeed;
    }
  }

  public update(intervalSec: number): void {
    this._moveTowardTo(intervalSec);
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
    app.context2D.translate(this.x, this.y);
    app.context2D.rotate(this.tankRotation);
    app.context2D.scale(this.scaleX, this.scaleY);
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

  public draw2(app: Editor): void {
    if (app.context2D === null) {
      return;
    }
    app.context2D.save();
    app.context2D.translate(this.x, this.y);
    app.context2D.rotate(
      this.initYAxis ? this.tankRotation - Math.PI * 0.5 : this.tankRotation
    );
    app.context2D.scale(this.scaleX, this.scaleY);
    app.context2D.save();
    app.context2D.fillStyle = "grey";
    app.context2D.beginPath();
    if (this.initYAxis) {
      app.context2D.rect(
        -this.height * 0.5,
        -this.width * 0.5,
        this.height,
        this.width
      );
    } else {
      app.context2D.rect(
        -this.width * 0.5,
        -this.height * 0.5,
        this.width,
        this.height
      );
    }
    app.context2D.fill();
    app.context2D.restore();
    app.context2D.save();
    app.context2D.rotate(this.turretRotation);
    app.context2D.fillStyle = "red";
    app.context2D.beginPath();
    if (this.initYAxis) {
      app.context2D.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2);
    } else {
      app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
    }
    app.context2D.fill();
    app.context2D.strokeStyle = "blue";
    app.context2D.lineWidth = 5;
    app.context2D.lineCap = "round";
    app.context2D.beginPath();
    app.context2D.moveTo(0, 0);
    if (this.initYAxis) {
      app.context2D.lineTo(0, this.gunLength);
    } else {
      app.context2D.lineTo(this.gunLength, 0);
    }
    app.context2D.stroke();
    if (this.initYAxis) {
      app.context2D.translate(0, this.gunLength);
      app.context2D.translate(0, this.gunMuzzleRadius);
    } else {
      app.context2D.translate(this.gunLength, 0);
      app.context2D.translate(this.gunMuzzleRadius, 0);
    }
    app.fillCircle(0, 0, 5, "black");
    app.context2D.restore();
    app.context2D.save();
    if (this.initYAxis) {
      app.context2D.translate(0, this.height * 0.5);
    } else {
      app.context2D.translate(this.width * 0.5, 0);
    }
    app.fillCircle(0, 0, 10, "green");
    app.context2D.restore();

    // 坐标系
    if (this.showCoord) {
      app.context2D.save();
      app.context2D.lineWidth = 1;
      app.context2D.lineCap = "butt";
      app.strokeCoord(0, 0, this.width * 1.2, this.height * 1.2);
      app.context2D.restore();
    }
    app.context2D.restore();

    if (this.showLine === false) {
      return;
    }
    app.context2D.save();
    app.strokeLine(
      this.x,
      this.y,
      app.canvas.width * 0.5,
      app.canvas.height * 0.5
    );
    app.strokeLine(this.x, this.y, this.targetX, this.targetY);
    app.context2D.restore();
  }
}
