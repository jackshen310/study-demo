import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { TileDebug, Zoomify } from "ol/source";
import Tools, { Mouse } from "../canvas-demo/basic/tools";
import { multiply, divide, add } from "mathjs";
import { getCenter } from "ol/extent";

const imgFile = "03.jpeg";
// canvas数据来源
const imgUrl = `http://127.0.0.1:9991/images/${imgFile}/0-0-0.jpg`;
// openlayers数据来源
const zoomifyUrl = `http://127.0.0.1:9991/images/${imgFile}/{z}-{x}-{y}.jpg?tileGroup={TileGroup}`;
// 原图宽、高
const imgW = 3968;
const imgH = 2976;
// 瓦片像素比（也即屏幕的一个像素代表瓦片的多少个像素）
const tilePixelRatio = 2;
// 瓦片尺寸
const tileSize = 256 * tilePixelRatio;
// 设备像素比
const pixelRatio = 1;

class Editor {
  // canvas 属性
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  offsetX = 0;
  offsetY = 0;
  scale: number = 1;

  // openlayers属性
  map: Map | null = null;
  fullTileRanges: any[] = [];

  // 公共属性
  tools: Tools;
  mouse: Mouse | null = null;

  constructor() {
    this.tools = new Tools();
    this.init();
  }

  init() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    this.ctx = ctx;
    this.canvas = canvas;

    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      this.initScale();
      this.initOpenlayers();
      this.initImage(img);
    };

    this.mouse = this.tools.getMouse(canvas);

    this.initEventListener(img);
  }
  initScale() {
    let canvasW = this.canvas!.width;
    let canvasH = this.canvas!.height;
    this.scale = Math.min(divide(canvasW, imgW), divide(canvasH, imgH));
  }
  // 图片平移、缩放事件处理
  initEventListener(img: HTMLImageElement) {
    const { canvas } = this;

    let x1 = 0;
    let y1 = 0;
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = 0;

    const onMouseMove = () => {
      let mouse = this.mouse!;
      // 计算移动距离
      x = mouse.x - x1;
      y = mouse.y - y1;
      // 计算偏移 = 原始坐标偏移 + 移动距离
      this.offsetX = add(dx, x);
      this.offsetY = add(dy, y);
      this.drawImage(img);
    };
    const onMouseUp = () => {
      canvas?.removeEventListener("mousemove", onMouseMove);
      canvas?.removeEventListener("mouseup", onMouseUp);
    };
    // 左键移动图片
    canvas?.addEventListener("mousedown", () => {
      const mouse = this.mouse!;
      // 记住原始鼠标位置
      x1 = mouse.x;
      y1 = mouse.y;
      // 记住原始坐标偏移
      dx = this.offsetX;
      dy = this.offsetY;
      canvas?.addEventListener("mousemove", onMouseMove);
      canvas?.addEventListener("mouseup", onMouseUp);
    });

    // 滚轮缩放
    canvas?.addEventListener("mousewheel", (event: any) => {
      const isUp = event?.deltaY < 0;
      let oldScale = this.scale;
      if (isUp) {
        this.scale = multiply(this.scale, 1.1);
      } else {
        this.scale = divide(this.scale, 1.1);
      }
      // 限制最小缩放比例
      this.scale = Math.max(this.scale, 0.05);

      // 基于鼠标点缩放
      // 假设缩放后，鼠标点的位置由原来的(event.offsetX,event.offsetY)变为(x1,x2)
      // 则x1,x2为
      let x1 =
        this.offsetX +
        (event.offsetX - this.offsetX) * divide(this.scale, oldScale);
      let y1 =
        this.offsetY +
        (event.offsetY - this.offsetY) * divide(this.scale, oldScale);
      // 计算偏移量
      let deltaX = x1 - event.offsetX;
      let deltaY = y1 - event.offsetY;
      // 减掉偏移量
      this.offsetX = this.offsetX - deltaX;
      this.offsetY = this.offsetY - deltaY;

      this.drawImage(img);
    });
  }

  initImage(img: HTMLImageElement) {
    const { canvas, ctx } = this;

    let canvasW = canvas!.width;
    let canvasH = canvas!.height;

    ctx?.save();
    this.ctx?.clearRect(0, 0, canvasW, canvasH);
    ctx?.translate((canvasW - imgW) / 2, (canvasH - imgH) / 2);
    ctx?.translate(imgW / 2, imgH / 2);

    let scale = this.scale;
    ctx?.scale(scale, scale);

    ctx?.translate(-(imgW / 2), -(imgH / 2));

    ctx?.drawImage(img, 0, 0, imgW, imgH);

    ctx?.restore();

    const contentImgW = imgW * scale;
    const contentImgH = imgH * scale;

    this.offsetX = (canvasW - contentImgW) / 2;
    this.offsetY = (canvasH - contentImgH) / 2;

    this.scaleToFit();
  }

  scaleToFit() {
    const { canvas, scale, offsetX, offsetY, fullTileRanges } = this;

    let canvasW = canvas!.width;
    let canvasH = canvas!.height;
    const contentImgW = imgW * scale;

    // 获取视图瓦片总宽度
    let tileResolution = 2;
    let tileResizeWidth = imgW;
    for (let i = 0; i < fullTileRanges.length; i++) {
      if (contentImgW < fullTileRanges[i].resizeWidth / 2) {
        tileResizeWidth = fullTileRanges[i].resizeWidth;
        tileResolution = fullTileRanges[i].resolution;
        break;
      }
    }
    // 计算视图分辨率
    let tileSale = contentImgW / tileResizeWidth;
    let viewResolution =
      tileResolution / ((tileSale * tilePixelRatio) / pixelRatio);
    // 计算视图范围（extent）
    let x1 = -offsetX * viewResolution;
    let y1 = -canvasH * viewResolution + offsetY * viewResolution;
    let x2 = canvasW * viewResolution + x1;
    let y2 = offsetY * viewResolution;
    // 设置视图分辨率及中心点
    this.map?.getView().setResolution(viewResolution);
    this.map?.getView().setCenter(getCenter([x1, y1, x2, y2]));
  }

  drawImage(img: HTMLImageElement) {
    const { canvas, ctx, scale } = this;
    let canvasW = canvas!.width;
    let canvasH = canvas!.height;
    ctx?.save();
    ctx?.clearRect(0, 0, canvasW, canvasH);
    ctx?.scale(scale, scale);
    ctx?.drawImage(
      img!,
      this.offsetX / scale,
      this.offsetY / scale,
      imgW,
      imgH
    );
    ctx?.restore();

    this.scaleToFit();
  }

  initOpenlayers() {
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

    let sizeX = Math.ceil(imgW / tileSize);
    let fullTileRanges: any[] = JSON.parse(
      JSON.stringify((source.getTileGrid() as any).fullTileRanges_)
    );

    fullTileRanges.forEach((item, index) => {
      let resizeWidth = Math.ceil((imgW / sizeX) * (item.maxX + 1));
      if (index !== fullTileRanges.length - 1) {
        resizeWidth = 512 * (item.maxX + 1);
      }
      let resolution = source.getTileGrid()?.getResolution(index);
      item.resizeWidth = resizeWidth;
      item.resolution = resolution;
    });
    this.fullTileRanges = fullTileRanges;
    console.log("source2", fullTileRanges);

    (window as any).source = source;
    // console.log("source", source.getTileGrid()?.getFullTileRange(0));
    // console.log("source", source.getTileGrid()?.getResolutions());
    const extent = layer.getSource()?.getTileGrid()?.getExtent();
    // 加入1、0最终组成[..., 16,8,4,2,1,0] 可以无限放大
    const resolutions = [
      ...layer.getSource()?.getTileGrid()?.getResolutions()!,
      1,
      0,
    ];

    // const proj = new Projection({
    //   code: "ZOOMIFY",
    //   units: "pixels",
    //   extent: [0, 0, imgW, imgH],
    // });
    const map = new Map({
      layers: [layer, debugLayer],
      target: "openlayers",
      view: new View({
        // adjust zoom levels to those provided by the source
        resolutions: resolutions,
        // constrain the center: center cannot be set outside this extent
        // extent: extent,
        // constrainOnlyCenter: false,
        zoomFactor: 1,
        // projection: proj,
        zoom: 1,
      }),
    });
    map.getView().fit(extent!);

    this.map = map;
    (window as any).layer = layer;
    (window as any).map = map;
  }

  getInfo() {
    return {
      imgSize: [imgW, imgH],
      offset: [this.offsetX, this.offsetY],
      scale: this.scale,
      point: [this.mouse?.x, this.mouse?.y],
      viewResolution: this.map?.getView().getResolution() || 0,
      center: this.map?.getView().getCenter() || [],
    };
  }
}

export default Editor;
