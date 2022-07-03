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
        <Link to="/canvas-grid">canvas大图加载</Link>
      </nav>
    </div>
  );
}

export default App;
