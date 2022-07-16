import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./index.css";
import Editor from "./editor";
import Vec2 from "./math/vec2";

const CanvasApplication = () => {
  const canvasRef = useRef<any>();
  const [editor, setEditor] = useState<Editor>();
  const [mouse, setMouse] = useState<Vec2>(Vec2.create());

  useEffect(() => {
    let editor = new Editor(canvasRef.current as HTMLCanvasElement);
    setEditor(editor);

    (window as any).editor = editor;
  }, []);

  useEffect(() => {
    const onMouseMove = () => {
      setMouse(editor?.getMouse()!);
    };
    const canvas = canvasRef.current;
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
          editor?.strokeGrid();
        },
        text: "网格线",
      },
      {
        click: () => {
          editor?.drawColor();
        },
        text: "调色板",
      },
      {
        click: () => {
          editor?.drawCanvasCoordCenter();
        },
        text: "中心点坐标系",
      },
      {
        click: () => {
          editor?.doTransform();
        },
        text: "变换",
      },
      {
        click: () => {
          editor?.drawTank();
        },
        text: "坦克",
      },
      {
        click: () => {
          editor?.getOrietation();
        },
        text: "朝向",
      },
      {
        click: () => {
          editor?.drawVecTest();
        },
        text: "画向量",
      },
      {
        click: () => {
          editor?.drawMouseLineProjection();
        },
        text: "投影算法",
      },
      {
        click: () => {
          editor?.isPointInXXX();
        },
        text: "碰撞检查",
      },
      {
        click: () => {
          editor?.drawSprite();
        },
        text: "精灵系统",
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
export default CanvasApplication;
