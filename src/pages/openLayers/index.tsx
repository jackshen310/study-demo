import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./index.css";
import Editor from "./editor";

const OpenLayers = () => {
  const [editor, setEditor] = useState<Editor>();

  useEffect(() => {
    let editor = new Editor();
    setEditor(editor);

    (window as any).editor = editor;
  }, []);

  return (
    <div>
      <div className="basic">
        <div className="left">
          <canvas id="canvas" width={800} height={600} />
        </div>
        <div className="right">
          <div id="openlayers"></div>
        </div>
      </div>
    </div>
  );
};
export default OpenLayers;
