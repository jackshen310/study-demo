import { useEffect } from "react";
import * as wasm from "wasm-game-of-life";

const WasmDemo = () => {
  const onClick = () => {
    wasm.greet();
  };

  useEffect(() => {
    wasm.greet();
  }, []);
  return (
    <div>
      wasm demo
      <button onClick={onClick}>clickMe</button>
    </div>
  );
};

export default WasmDemo;
