import Tools, { Mouse } from "../basic/tools";
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
  mouse: Mouse | null;

  constructor(id: string) {
    this.tools = new Tools();
    this.id = id;
    this.mouse = null;
    this.init();
  }

  init() {
    this.canvas = new fabric.Canvas(this.id); // 这里传入的是canvas的id
    // 创建不可交互的画布，其实只需把 new fabric.Canvas 改成 new fabric.StaticCanvas 即可

    this.canvas.on("mouse:move", (options: any) => {
      this.mouse = {
        x: Math.ceil(options.absolutePointer.x),
        y: Math.ceil(options.absolutePointer.y),
      };
    });
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
    return this.mouse;
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

  drawTextbox() {
    const { canvas } = this;

    const textbox = new fabric.Textbox("Lorum ipsum dolor sit amet", {
      width: 250,
    });
    canvas.add(textbox);
  }

  drawGroup() {
    const { canvas } = this;
    // 椭圆
    const ellipse = new fabric.Ellipse({
      top: 20,
      left: 20,
      rx: 100,
      ry: 50,
      fill: "#ddd",
      originX: "center", // 旋转x轴：left, right, center
      originY: "center", // 旋转y轴：top, bottom, center
    });

    // 文本
    const text = new fabric.Text("Hello World", {
      top: 40,
      left: 20,
      fontSize: 20,
      originX: "center",
      originY: "center",
    });

    // 建组
    const group = new fabric.Group([ellipse, text], {
      top: 50, // 整组距离顶部100
      left: 100, // 整组距离左侧100
      angle: -10, // 整组旋转-10deg
    });

    canvas.add(group);
  }

  drawAnimate() {
    const { canvas } = this;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: "red",
    });

    // 设置矩形动画
    rect.animate("angle", "-50", {
      onChange: canvas.renderAll.bind(canvas), // 每次刷新的时候都会执行
    });

    canvas.add(rect);
  }

  drawZoom() {
    const { canvas } = this;
    // 矩形（参照物）
    const rect = new fabric.Rect({
      top: 10,
      left: 10,
      width: 40,
      height: 40,
      fill: "orange",
    });

    // 圆形（参照物）
    const circle = new fabric.Circle({
      top: 30,
      left: 30,
      radius: 50,
      fill: "green",
    });
    canvas.add(rect, circle); // 将矩形和圆形添加到画布中

    // 监听鼠标滚轮事件
    canvas.on("mouse:wheel", (opt: any) => {
      let delta = opt.e.deltaY; // 滚轮向上滚一下是 -100，向下滚一下是 100
      let zoom = canvas.getZoom(); // 获取画布当前缩放值
      // 控制缩放范围在 0.01~20 的区间内
      zoom *= 0.999 ** delta; // x**n  相当于 Math.pow(x,n)  即x的n次方
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;

      // 设置画布缩放比例
      canvas.setZoom(zoom);
    });
  }

  drawFromJson() {
    const { canvas } = this;
    const str =
      '{"version":"4.6.0","objects":[{"type":"rect","version":"4.6.0","originX":"left","originY":"top","left":50,"top":50,"width":20,"height":20,"fill":"green","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"circle","version":"4.6.0","originX":"left","originY":"top","left":80,"top":80,"width":80,"height":80,"fill":"red","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":40,"startAngle":0,"endAngle":6.283185307179586}],"background":"#ddd"}';

    // 反序列化
    canvas.loadFromJSON(str);
  }
}

export default Editor;
