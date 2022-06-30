import React, { useEffect, useRef, useState, memo } from "react";
import Editor from "./editor";
import "./index.css";

const CanvasGrid = memo(() => {
  const canvasRef = useRef(null);
  const [editor, setEditor] = useState<Editor>();
  const [selectIndex, setSelectIndex] = useState(0);
  useEffect(() => {
    if ((window as any).gridEditor) {
      return;
    }
    const canvas = canvasRef.current! as HTMLCanvasElement;
    const editor = new Editor(canvas);
    (window as any).gridEditor = editor;
    editor.init();
    setEditor(editor);
  }, []);

  const handleAdd = () => {
    editor?.handleScale(1.2);
  };
  const handleDel = () => {
    editor?.handleScale(0.8);
  };

  const handleClick = (index: number) => {
    editor?.setImage(index);
    setSelectIndex(index);
  };
  const renderImage = () => {
    return editor?.images.map((item, index) => {
      let className = "";
      if (selectIndex == index) {
        className = "active";
      }
      return (
        <li
          onClick={(e) => {
            e.preventDefault();
            handleClick(index);
          }}
          className={className}
        >
          image_{index + 1}
        </li>
      );
    });
  };
  return (
    <div>
      <div className="large-image">
        <ul className="left">{renderImage()}</ul>
        <canvas
          className="right"
          ref={canvasRef}
          key="1"
          style={{ border: "1px solid green" }}
          id="canvas"
          width="1000"
          height="1000"
        ></canvas>
      </div>
      <button onClick={handleAdd}>放大</button>
      <button onClick={handleDel}>缩小</button>
    </div>
  );
});

export default CanvasGrid;
