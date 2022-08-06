import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./index.css";
import Editor from "./editor";

const CanvasKonva = () => {
  const canvasRef = useRef<any>();
  const [editor, setEditor] = useState<Editor>();
  const [mouse, setMouse] = useState<any>({});

  useEffect(() => {
    let editor = new Editor("canvas");
    setEditor(editor);

    (window as any).editor = editor;
  }, []);

  const renderBtn = () => {
    let btns: { click: MouseEventHandler; text: string }[] = [];
    btns.push(
      {
        click: () => {
          editor?.drawCircle();
        },
        text: "画圆",
      },
      {
        click: () => {
          editor?.drawPolygon();
        },
        text: "多边形",
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
          <div
            key="canvas"
            id="canvas"
            ref={canvasRef}
            style={{ border: "1px solid green" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default CanvasKonva;
