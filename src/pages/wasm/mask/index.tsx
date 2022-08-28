import { useEffect, useState, useMemo } from "react";
import * as wasm from "wasm-game-of-life";
// Import the WebAssembly memory at the top of the file.
import { memory } from "wasm-game-of-life/wasm_bg.wasm";
import FPS from "../game-of-life/fps";

const MaskDemo = () => {
  // const [textContent, setTextContent] = useState("");
  const mask = useMemo(() => wasm.Mask.new(), []);

  const onClick = () => {
    mask.greet();
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
