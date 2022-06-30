import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./index.css";
import Editor from "./editor";

const Basic = () => {
  const canvasRef = useRef<any>();
  const [editor, setEditor] = useState<Editor>();

  useEffect(() => {
    let editor = new Editor(canvasRef.current);
    setEditor(editor);

    (window as any).editor = editor;
  }, []);

  const renderBtn = () => {
    let btns: { click: MouseEventHandler; text: string }[] = [];
    btns.push(
      {
        click: () => {
          editor?.drawLine();
        },
        text: "画直线",
      },
      {
        click: () => {
          editor?.strokeRect();
        },
        text: "描边矩形",
      },
      {
        click: () => {
          editor?.fillRect();
        },
        text: "填充矩形",
      },
      {
        click: () => {
          editor?.colorPalette();
        },
        text: "调色板",
      },
      {
        click: () => {
          editor?.arc();
        },
        text: "画圆",
      },
      {
        click: () => {
          editor?.arcTo();
        },
        text: "画弧线",
      },
      {
        click: () => {
          editor?.createRounderRect();
        },
        text: "圆角矩形",
      },
      {
        click: () => {
          editor?.lineWidth();
        },
        text: "线条宽度",
      },
      {
        click: () => {
          editor?.strokeText();
        },
        text: "描边文本",
      },
      {
        click: () => {
          editor?.fillText();
        },
        text: "填充文本",
      },
      {
        click: () => {
          editor?.drawImage();
        },
        text: "画图",
      },
      {
        click: () => {
          editor?.createPattern();
        },
        text: "背景图填充",
      },
      {
        click: () => {
          editor?.clip();
        },
        text: "裁剪",
      },
      {
        click: () => {
          editor?.translate();
        },
        text: "移动",
      },
      {
        click: () => {
          editor?.scale();
        },
        text: "缩放",
      },
      {
        click: () => {
          editor?.rotate();
        },
        text: "旋转",
      }
    );

    return btns.map((item, index) => (
      <button key={index} onClick={item.click}>
        {item.text}
      </button>
    ));
  };
  return (
    <div>
      <div className="basic">
        <div className="left">{renderBtn()}</div>
        <canvas
          className="right"
          ref={canvasRef}
          style={{ border: "1px solid green" }}
          id="canvas"
          width="800"
          height="600"
        ></canvas>
      </div>
    </div>
  );
};
export default Basic;
