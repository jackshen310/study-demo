import { memo } from "react";
import Basic from "./basic";

const CanvasDemo = memo(() => {
  // return <LargeImage key="123" />
  return <Basic key="basic" />;
});

export default CanvasDemo;
