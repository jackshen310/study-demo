import { useEffect, useState, useMemo } from "react";
import * as wasm from "wasm-game-of-life";
// Import the WebAssembly memory at the top of the file.
import { memory } from "wasm-game-of-life/wasm_bg.wasm";
import FPS from "../game-of-life/fps";
import data from "./data.json";

const MaskDemo = () => {
  // const [textContent, setTextContent] = useState("");
  const helper = useMemo(() => wasm.MaskHelper.new(), []);

  const onClick = () => {
    const { label, infer, labelOpacity: opacity, drawImage, filter } = data;
    if (!Array.isArray(label) || !Array.isArray(infer)) {
      return;
    }
    console.time("mask");
    if (filter.includes("ANNOTATION")) {
      label.forEach((anno) => {
        const { color, mask = {} } = anno;
        const isMask = Object.keys(mask || {}).length > 0;
        if (!isMask) {
          return;
        }
        helper.get_label_from_mask(mask, color, Number(opacity));

        const imageDataPtr = helper.image_data();
        let width = helper.width();
        let height = helper.height();
        let array = new Uint8ClampedArray(
          memory.buffer,
          imageDataPtr,
          width * height * 4
        );
        (anno as any).imageData = new ImageData(array, width, height);
      });
    }
    if (filter.includes("INFER")) {
      infer.forEach((anno) => {
        const { color, mask = {} } = anno;
        const isMask = Object.keys(mask || {}).length > 0;
        if (!isMask) {
          return;
        }
        helper.get_infer_from_mask(mask, color);

        const imageDataPtr = helper.image_data();
        let width = helper.width();
        let height = helper.height();
        let array = new Uint8ClampedArray(
          memory.buffer,
          imageDataPtr,
          width * height * 4
        );
        (anno as any).imageData = new ImageData(array, width, height);
      });
    }
    console.timeEnd("mask");
    console.log(label);
  };
  useEffect(() => {
    const fps = new FPS();
    const renderLoop = () => {
      fps.render(); //new
      requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }, []);
  return (
    <div>
      <div id="fps"></div>
      <button onClick={onClick}>clickMe</button>
    </div>
  );
};

export default MaskDemo;
