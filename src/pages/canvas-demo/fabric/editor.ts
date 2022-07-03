import Tools from "../basic/tools";
import avatar from "../images/avatar.jpg";
import Rect from "react";
import jailCellBars from "../images/jail_cell_bars.png";

import { fabric } from "fabric";

/**
 * https://juejin.cn/post/7026941253845516324
 * https://github.com/fabricjs/fabric.js
 */
class Editor {
  tools: Tools;
  canvas: any;
  id: string;

  constructor(id: string) {
    this.tools = new Tools();
    this.id = id;
    this.init();
  }

  init() {
    this.canvas = new fabric.Canvas(this.id); // 这里传入的是canvas的id
    // 创建不可交互的画布，其实只需把 new fabric.Canvas 改成 new fabric.StaticCanvas 即可
  }

  drawRect() {
    const { canvas } = this;

    const rect = new fabric.Rect({
      top: 30,
      left: 30,
      width: 100,
      height: 60,
      fill: "red",
    });
    // 在canvas画布中加入矩形rect
    canvas.add(rect);
  }

  getMouse() {
    return this.tools.getMouse(
      document.getElementsByClassName(".upper-canvas")[0] as HTMLElement
    );
  }

  drawCircle() {
    // 圆形
    const circle = new fabric.Circle({
      radius: 30, // 圆的半径
      top: 20, // 距离容器顶部 20px
      left: 20, // 距离容器左侧 20px
      fill: "pink", // 填充 粉色
    });

    this.canvas.add(circle); // 将圆形添加到 canvas 画布里
  }

  drawBackgroundImage() {
    // 设置背景图
    // 参数1：背景图资源（可以引入本地，也可以使用网络图）
    // 参数2：设置完背景图执行以下重新渲染canvas的操作，这样背景图就会展示出来了
    this.canvas.setBackgroundImage(
      "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27d1b4e5f8824198b6d51a2b1c2d0d75~tplv-k3u1fbpfcp-zoom-crop-mark:400:400:400:400.awebp",
      this.canvas.renderAll.bind(this.canvas),
      {
        angle: 15, // 旋转背景图
      }
    );
  }

  drawOverlayImage() {
    const { canvas } = this;
    canvas.add(
      new fabric.Circle({
        radius: 30, // 圆形半径
        fill: "#f55",
        top: 70,
        left: 70,
      })
    );

    // 设置覆盖图像的画布
    canvas.setOverlayImage(
      // setOverlayImage(image, callback, optionsopt)
      jailCellBars, // 图片，script开头import进来的
      canvas.renderAll.bind(canvas)
    );
  }

  drawEllipse() {
    const { canvas } = this;
    const ellipse = new fabric.Ellipse({
      top: 20,
      left: 20,
      rx: 70,
      ry: 30,
      fill: "hotpink",
    });
    canvas.add(ellipse);
  }

  drawTriangle() {
    const { canvas } = this;
    const triangle = new fabric.Triangle({
      top: 100,
      left: 100,
      width: 200, // 底边长度
      height: 100, // 底边到对角的距离
      fill: "blue",
    });
    canvas.add(triangle);
  }

  drawLine() {
    const { canvas } = this;
    const line = new fabric.Line(
      [
        10,
        10, // 起始点坐标
        200,
        300, // 结束点坐标
      ],
      {
        stroke: "red", // 笔触颜色
      }
    );
    canvas.add(line);
  }

  drawPolyLine() {
    const { canvas } = this;
    const polyline = new fabric.Polyline(
      [
        { x: 30, y: 30 },
        { x: 150, y: 140 },
        { x: 240, y: 150 },
        { x: 100, y: 30 },
      ],
      {
        fill: "transparent", // 如果画折线，需要填充透明
        stroke: "#6639a6", // 线段颜色：紫色
        strokeWidth: 5, // 线段粗细 5
      }
    );
    canvas.add(polyline);
  }

  drawText() {
    const { canvas } = this;
    const text = new fabric.Text("雷猴啊");
    canvas.add(text);
  }

  drawIText() {
    const { canvas } = this;
    const itext = new fabric.IText("雷猴啊");
    canvas.add(itext);
  }
}

export default Editor;
