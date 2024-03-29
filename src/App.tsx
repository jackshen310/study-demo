import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/canvas-basic">canvas基础知识</Link>|{" "}
        <Link to="/canvas-box">canvas基础图形</Link>|{" "}
        <Link to="/canvas-fabricjs">canvas FabricJs 工具库</Link>|{" "}
        <Link to="/canvas-application">canvas 架构设计</Link>|{" "}
        <Link to="/canvas-grid">canvas大图加载</Link>|{" "}
        <Link to="/canvas-konva">canvas Konva</Link>|{" "}
        <Link to="/redux-counter">Redux-Counter</Link>|{" "}
        <Link to="/webgl-basic">Webgl-basic</Link>|{" "}
        <Link to="/three-basic">Three-basic</Link>|{" "}
        <Link to="/rust">rust demo</Link>| <Link to="/wasm">wasm demo</Link>|{" "}
        <Link to="/canvas-v">canvas v</Link>
        <Link to="/openLayers">OpenLayers</Link>
      </nav>
    </div>
  );
}

export default App;
