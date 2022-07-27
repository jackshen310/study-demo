import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./index.css";
import Editor from "./editor";

const WebglBasic = () => {
  const canvasRef = useRef<any>();
  const [editor, setEditor] = useState<Editor>();

  useEffect(() => {
    let editor = new Editor(canvasRef.current);
    setEditor(editor);

    (window as any).editor = editor;
  }, []);

  const renderBtn = () => {
    let btns: { click: MouseEventHandler; text: string }[] = [];
    btns.push({
      click: () => {
        editor?.drawTrigle();
      },
      text: "清空画布",
    });

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
        <div className="right">
          <canvas
            key="canvas"
            ref={canvasRef}
            style={{ border: "1px solid green" }}
            id="canvas"
            width="800"
            height="600"
          ></canvas>
        </div>
      </div>
    </div>
  );
};
export default WebglBasic;
