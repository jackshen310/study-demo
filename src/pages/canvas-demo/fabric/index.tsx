import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./index.css";
import Editor from "./editor";

const CanvasFabric = () => {
  const canvasRef = useRef<any>();
  const [editor, setEditor] = useState<Editor>();
  const [mouse, setMouse] = useState<any>({});

  useEffect(() => {
    let editor = new Editor("canvas");
    setEditor(editor);

    (window as any).editor = editor;
  }, []);

  useEffect(() => {
    const onMouseMove = () => {
      setMouse({ ...editor?.getMouse() });
    };
    const canvas = document;
    if (!canvas) {
      return;
    }
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [editor]);

  const renderBtn = () => {
    let btns: { click: MouseEventHandler; text: string }[] = [];
    btns.push(
      {
        click: () => {
          editor?.drawRect();
        },
        text: "画矩形",
      },
      {
        click: () => {
          editor?.drawCircle();
        },
        text: "画圆",
      },
      {
        click: () => {
          editor?.drawBackgroundImage();
        },
        text: "背景图",
      },
      {
        click: () => {
          editor?.drawOverlayImage();
        },
        text: "背景图2",
      },
      {
        click: () => {
          editor?.drawEllipse();
        },
        text: "椭圆",
      },
      {
        click: () => {
          editor?.drawTriangle();
        },
        text: "三角形",
      },
      {
        click: () => {
          editor?.drawLine();
        },
        text: "直线",
      },
      {
        click: () => {
          editor?.drawPolyLine();
        },
        text: "折线",
      },
      {
        click: () => {
          editor?.drawText();
        },
        text: "文本",
      },
      {
        click: () => {
          editor?.drawIText();
        },
        text: "可编辑文本",
      },
      {
        click: () => {
          editor?.drawTextbox();
        },
        text: "文本框",
      },
      {
        click: () => {
          editor?.drawGroup();
        },
        text: "分组",
      },
      {
        click: () => {
          editor?.drawAnimate();
        },
        text: "动画",
      },
      {
        click: () => {
          editor?.drawZoom();
        },
        text: "缩放",
      },
      {
        click: () => {
          editor?.drawFromJson();
        },
        text: "反序列化",
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
      <div className="box">
        <div className="left">{renderBtn()}</div>
        <div className="right">
          <p>
            当前坐标 x:{mouse.x} , y:{mouse.y}
          </p>
          <canvas
            key="canvas"
            id="canvas"
            ref={canvasRef}
            style={{ border: "1px solid green" }}
            width="800"
            height={600}
          ></canvas>
        </div>
      </div>
    </div>
  );
};
export default CanvasFabric;
