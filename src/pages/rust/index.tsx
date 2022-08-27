import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import data from "./mask.json";
const RustDemo = () => {
  const handleData = (data: any) => {
    if (!data) {
      return;
    }
    console.log("handle data...", data);
    const { label, infer, response_time } = data;

    label.forEach((item: any) => {
      if (!item.maskData) {
        return;
      }

      const { data, width, height } = item.maskData;
      item.imageData = new ImageData(
        Uint8ClampedArray.from(data),
        width,
        height
      );
      delete item.maskData;
    });
    infer.forEach((item: any) => {
      if (!item.maskData) {
        return;
      }
      const { data, width, height } = item.maskData;
      item.imageData = new ImageData(
        Uint8ClampedArray.from(data),
        width,
        height
      );
      delete item.maskData;
    });
    console.timeEnd("mask");
    console.log("to response: ", new Date().getTime() - response_time);
    console.log(data);
  };
  // Invoke the command
  const onClick = () => {
    console.time("mask");
    let requestTime = new Date().getTime();
    invoke("mask_to_image_data", {
      filter: data.filter,
      labelOpacity: data.labelOpacity,
      drawImage: data.drawImage,
      label: data.label,
      infer: data.infer,
      requestTime,
    }).then((data: any) => {
      handleData(data);
    });
  };
  useEffect(() => {
    onClick();

    listen("mask", (event) => {
      // console.log("event", event.payload);
      handleData(event.payload);
    });
  }, []);
  return (
    <div>
      rust dev
      <button onClick={onClick}>mask</button>
    </div>
  );
};

export default RustDemo;
