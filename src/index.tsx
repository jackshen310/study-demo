import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CanvasGrid from "./pages/canvas-demo/grid";
import CanvasBasic from "./pages/canvas-demo/basic";
import CanvasBox from "./pages/canvas-demo/box";
import CanvasFabric from "./pages/canvas-demo/fabric/index";
import CanvasApplication from "./pages/canvas-demo/application/index";
import WebglBasic from "./pages/webgl/basic";
import ThreeBasic from "./pages/webgl/threejs/index";
import ReduxDemo from "./pages/redux";
import "antd/dist/antd.css";
import CanvasKonva from "./pages/canvas-demo/konva";
import RustDemo from "./pages/rust";
import WasmDemo from "./pages/wasm/index";
import CanvasV from "./pages/canvas-demo/v-canvas";
import OpenLayers from "./pages/openLayers/index";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="canvas-basic" element={<CanvasBasic />} />
      <Route path="canvas-box" element={<CanvasBox />} />
      <Route path="canvas-grid" element={<CanvasGrid />} />
      <Route path="canvas-fabricjs" element={<CanvasFabric />} />
      <Route path="canvas-application" element={<CanvasApplication />} />
      <Route path="canvas-konva" element={<CanvasKonva />} />
      <Route path="redux-counter" element={<ReduxDemo />} />
      <Route path="webgl-basic" element={<WebglBasic />} />
      <Route path="three-basic" element={<ThreeBasic />} />
      <Route path="rust" element={<RustDemo />} />
      <Route path="wasm" element={<WasmDemo />} />
      <Route path="canvas-v" element={<CanvasV />} />
      <Route path="openLayers" element={<OpenLayers />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
