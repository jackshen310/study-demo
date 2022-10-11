import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { TileDebug, Zoomify } from "ol/source";
import Tools, { Mouse } from "../canvas-demo/basic/tools";
import { multiply, divide } from "mathjs";

const imgFile = "03.jpeg";
const imgUrl = `http://127.0.0.1:9991/images/${imgFile}/0-0-0.jpg`;
const zoomifyUrl = `http://127.0.0.1:9991/images/${imgFile}/{z}-{x}-{y}.jpg?tileGroup={TileGroup}`;
const imgW = 3968;
const imgH = 2976;

class Editor {
  // canvas 属性
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  tools: Tools;
  mouse: Mouse | null = null;

  // openlayers属性
  layer: TileLayer<Zoomify> | null = null;
  map: Map | null = null;

  // 公共属性
  scale: number = 1;
  img: HTMLImageElement | null = null;

  constructor() {
    this.tools = new Tools();
    this.initCanvas();
    // this.initOpenlayers();
  }

  initCanvas() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    this.ctx = ctx;
    this.canvas = canvas;

    const img = new Image();
    // img.src = "http://127.0.0.1:9991/origins/03.jpeg";
    img.src = imgUrl;
    img.onload = () => {
      this.initScale();
      this.initOpenlayers();
      this.drawImage(0, 0);
    };
    this.img = img;
    this.mouse = this.tools.getMouse(canvas);

    this.dragImage();
  }

  // 拖拽图片
  dragImage() {
    const { canvas } = this;

    let x1 = 0;
    let y1 = 0;
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = 0;

    const onMouseMove = () => {
      let mouse = this.mouse!;
      x = mouse.x - x1;
      y = mouse.y - y1;

      this.drawImage(dx + x, dy + y);
    };
    const onMouseUp = () => {
      dx = dx + x;
      dy = dy + y;
      canvas?.removeEventListener("mousemove", onMouseMove);
      canvas?.removeEventListener("mouseup", onMouseUp);
    };
    // 左键移动图片
    canvas?.addEventListener("mousedown", () => {
      const mouse = this.mouse!;
      x1 = mouse.x;
      y1 = mouse.y;
      canvas?.addEventListener("mousemove", onMouseMove);
      canvas?.addEventListener("mouseup", onMouseUp);
    });

    // 滚轮缩放图片
    canvas?.addEventListener("mousewheel", (event: any) => {
      const isUp = event?.deltaY < 0;
      if (isUp) {
        this.scale = multiply(this.scale, 1.1);
      } else {
        this.scale = divide(this.scale, 1.1);
      }
      this.drawImage(dx, dy);
    });
  }
  initScale() {
    let canvasW = this.canvas!.width;
    let canvasH = this.canvas!.height;
    // let imgW = this.img?.width!;
    // let imgH = this.img?.height!;
    console.log(divide(canvasW, imgW), divide(canvasH, imgH));
    console.log(imgH / canvasH);
    this.scale = Math.min(divide(canvasW, imgW), divide(canvasH, imgH));
  }
  drawImage(dx: number, dy: number) {
    const { canvas, ctx } = this;

    let canvasW = canvas!.width;
    let canvasH = canvas!.height;
    // let imgW = this.img?.width!;
    // let imgH = this.img?.height!;

    ctx?.save();
    this.ctx?.clearRect(0, 0, canvasW, canvasH);
    ctx?.translate((canvasW - imgW) / 2, (canvasH - imgH) / 2);
    ctx?.translate(imgW / 2, imgH / 2);

    let scale = this.scale;
    ctx?.scale(scale, scale);
    console.log("scale", scale);

    ctx?.translate(-(imgW / 2), -(imgH / 2));
    let X = divide(dx, scale);
    let Y = divide(dy, scale);

    ctx?.drawImage(this.img!, X, Y, imgW, imgH);

    ctx?.restore();

    // 同步设置openlayers的图片偏移量、缩放关系（用分辨率表示）
    console.log("dx,dy", X, Y, imgW / 2 - X, -(imgH / 2) + Y);
    this.map?.getView().setCenter([imgW / 2 - X, -(imgH / 2) + Y]);
    this.map?.getView().setResolution(divide(1, scale));
  }

  initOpenlayers() {
    // const imgWidth = this.img?.width!;
    // const imgHeight = this.img?.height!;
    const source = new Zoomify({
      url: zoomifyUrl,
      size: [imgW, imgH],
      crossOrigin: "anonymous",
      zDirection: -1, // Ensure we get a tile with the screen resolution or higher
      tilePixelRatio: 2,
      tileSize: 256, // with imgage size 512 * 512
    });
    // const extent = source.getTileGrid()?.getExtent();

    const layer = new TileLayer({
      source: source,
    });

    // for debug
    const debugLayer = new TileLayer({
      source: new TileDebug({
        template: "z:{z} x:{x} y:{-y}",
        projection: source.getProjection()!,
        tileGrid: source.getTileGrid()!,
        zDirection: -1,
      }),
    });
    const extent = layer.getSource()?.getTileGrid()?.getExtent();
    // 加入1、0最终组成[..., 16,8,4,2,1,0] 可以无限放大
    const resolutions = [
      ...layer.getSource()?.getTileGrid()?.getResolutions()!,
      1,
      0,
    ];
    const map = new Map({
      layers: [layer, debugLayer],
      target: "openlayers",
      view: new View({
        // adjust zoom levels to those provided by the source
        resolutions: resolutions,
        // constrain the center: center cannot be set outside this extent
        // extent: extent,
        // constrainOnlyCenter: true,
        zoomFactor: 1,
        zoom: 1,
      }),
    });
    // map.getView().fit(extent!);

    this.layer = layer;
    this.map = map;
    (window as any).layer = layer;
    (window as any).map = map;
  }
}

export default Editor;
