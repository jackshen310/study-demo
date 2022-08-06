import { Mouse } from "../basic/tools";
import avatar from "../images/avatar.jpg";
import Rect from "react";
import Konva from "konva";

class Editor {
  canvas: any;
  mouse: Mouse | null;
  stage: Konva.Stage;

  constructor(id: string) {
    this.mouse = null;

    // first we need to create a stage
    this.stage = new Konva.Stage({
      container: id, // id of container <div>
      width: 800,
      height: 600,
    });

    this.init();
  }

  init() {}

  drawCircle() {
    const { stage } = this;
    // create our shape
    const circle = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 70,
      fill: "red",
      stroke: "black",
      strokeWidth: 4,
    });
    // 事件处理
    circle.on("mouseout touchend", function () {
      console.log("user input");
    });

    circle.on("click", function () {
      console.log("click");
    });

    circle.on("dragend", function () {
      console.log("drag stopped");
    });

    this.add2LayerAndDraw(circle);
  }

  drawPolygon() {
    const { stage } = this;
    const pentagon = new Konva.RegularPolygon({
      x: stage.width() / 2,
      y: stage.height() / 2,
      sides: 5,
      radius: 70,
      fill: "red",
      stroke: "black",
      strokeWidth: 4,
      shadowOffsetX: 20,
      shadowOffsetY: 25,
      shadowBlur: 40,
      opacity: 0.5,
    });

    this.add2LayerAndDraw(pentagon);
  }

  drwaAnim() {
    // var tween = new Konva.Tween({
    //   node: rect,
    //   duration: 1,
    //   x: 140,
    //   rotation: Math.PI * 2,
    //   opacity: 1,
    //   strokeWidth: 6,
    // });
    // tween.play();
    // // or new shorter method:
    // circle.to({
    //   duration: 1,
    //   fill: "green",
    // });
  }

  add2LayerAndDraw(shape: Konva.Shape) {
    const { stage } = this;

    const layer = new Konva.Layer();

    // add the shape to the layer
    layer.add(shape);

    // add the layer to the stage
    stage.add(layer);

    // draw the image
    layer.draw();
  }
  getMouse() {
    return this.mouse;
  }
}

export default Editor;
