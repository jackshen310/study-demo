import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./index.css";
import Editor from "./editor";

const CanvasBox = () => {
  const canvasRef = useRef<any>();
  const canvasViewRef = useRef<any>();
  const [editor, setEditor] = useState<Editor>();
  const [mouse, setMouse] = useState<any>({});

  useEffect(() => {
    let editor = new Editor(canvasRef.current, canvasViewRef.current);
    setEditor(editor);

    (window as any).editor = editor;
  }, []);

  useEffect(() => {
    const onMouseMove = () => {
      setMouse({ ...editor?.getMouse() });
    };
    const canvas = canvasViewRef.current;
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
          editor?.clearRect();
        },
        text: "清空画布",
      },
      {
        click: () => {
          editor?.save();
        },
        text: "保存状态",
      },
      {
        click: () => {
          editor?.restore();
        },
        text: "恢复状态",
      },
      {
        click: () => {
          editor?.drawLine();
        },
        text: "画直线",
      },
      {
        click: () => {
          editor?.drawStrokeRect();
        },
        text: "画矩形",
      },
      {
        click: () => {
          editor?.drawStrokeCircle();
        },
        text: "画圆形",
      },
      {
        click: () => {
          editor?.dragShape();
        },
        text: "拖拽",
      },
      {
        click: () => {
          editor?.drawStrokeTriangle();
        },
        text: "三角形",
      },
      {
        click: () => {
          editor?.drawStrokePolygon();
        },
        text: "多边形",
      },
      {
        click: () => {
          editor?.drawStrokeEllipse();
        },
        text: "椭圆",
      },
      {
        click: () => {
          editor?.drawStrokeText();
        },
        text: "文本",
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
            ref={canvasRef}
            style={{ border: "1px solid green" }}
            width="800"
            height={600}
          ></canvas>
          <canvas
            key="canvasView"
            ref={canvasViewRef}
            style={{ border: "1px solid green" }}
            width="800"
            height={600}
          ></canvas>
        </div>
      </div>
    </div>
  );
};
export default CanvasBox;
