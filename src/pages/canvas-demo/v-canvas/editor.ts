import Tools, { Mouse } from "../basic/tools";
import avatar from "../images/avatar.jpg";
import Rect from "react";
import VCanvas, { Shape, Line, Circle } from "smart-canvas";

class Editor {
  canvas: any;
  mouse: Mouse | null;
  editor: VCanvas;
  tools: Tools;

  constructor(id: string) {
    this.tools = new Tools();
    this.mouse = this.tools.getMouse(document.getElementById(id)!);

    const editor = new VCanvas({
      // 编辑器父元素
      container: document.getElementById(id)!,
      // 设置编辑器默认宽高
      canvasSize: { width: 800, height: 600 },
      adaptScaleMode: "raw",
    } as any);

    this.editor = editor;
    (window as any).editor = editor;
    this.init();
  }

  init() {}

  drawText() {
    const { editor } = this;

    editor.addShape(
      new Shape({
        name: "shape",
        text: {
          content: "测试文字",
          style: {
            // 背景色填充
            backgroundColor: "rgba(225,225,225,0.5)",
            // 字体大小
            fontSize: 12,
            // 文字颜色
            fillStyle: "green",
            textAlign: "",
          },
        },
        shapeStyle: {},
        style: {
          strokeStyle: "yellow",
          lineWidth: 2,
        },
        coordinateList: [
          { X: 100, Y: 100 },
          { X: 200, Y: 100 },
          { X: 200, Y: 200 },
          { X: 100, Y: 200 },
        ],
      })
    );

    editor.draw();
  }

  async drawImage() {
    const { editor } = this;

    // 添加图片
    await editor.setImage(avatar);
    editor.draw();
  }

  getMouse() {
    return this.mouse;
  }
}

export default Editor;
