import { useEffect, useState } from "react";
import "./index.css";
import Editor from "./editor";

const OpenLayers = () => {
  const [editor, setEditor] = useState<Editor>();
  const [info, setInfo] = useState<any>(null);
  useEffect(() => {
    let editor = new Editor();
    setEditor(editor);

    (window as any).editor = editor;

    let t = setInterval(() => {
      setInfo(editor.getInfo());
    }, 100);
    return () => {
      t && clearInterval(t);
    };
  }, []);

  return (
    <div>
      <div className="page-openlayers">
        <div className="left">
          {info && (
            <p>
              原图:({info.imgSize[0]}x{info.imgSize[1]}) 偏移:({info.offset[0]},
              {info.offset[1]}) 缩放:({info.scale}) 鼠标:({info.point[0]},
              {info.point[1]})
            </p>
          )}
          <canvas id="canvas" width={800} height={800} />
        </div>
        <div className="right">
          {info && (
            <p>
              分辨率:({info.viewResolution}) 中心点:({info.center[0]},
              {info.center[1]})
            </p>
          )}
          <div id="openlayers"></div>
        </div>
      </div>
    </div>
  );
};
export default OpenLayers;
