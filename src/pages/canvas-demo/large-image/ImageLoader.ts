
import image03 from '../images/03.jpeg'; // 原图
import image04 from '../images/04.jpeg'; // 压缩图
import './tools'
import lodash from 'lodash';

class ImageLoader {
    ctx: CanvasRenderingContext2D
    ctx2: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    offCanvas: HTMLCanvasElement
    offCtx: CanvasRenderingContext2D
    mouse: { x: number; y: number } = { x: 0, y: 0 }
    originX = 0
    originY = 0
    scale = 1
    img1: HTMLImageElement | null = null
    img2: HTMLImageElement | null = null

    constructor(canvas: HTMLCanvasElement, canvas2: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.ctx2 = canvas2.getContext('2d')!;
        this.canvas = canvas;

        this.offCanvas = document.createElement('canvas');
        this.offCtx = this.offCanvas.getContext('2d')!;

        this.mouse = (window as any).tools.getMouse(canvas);
        this.init();
    }
    init() {
        const img1 = new Image();
        img1.src = image04;
        this.img1 = img1;
        img1.onload = () => {
            this.offCanvas.width = img1.width;
            this.offCanvas.height = img1.height;
            this.offCtx.drawImage(img1, 0, 0);

            let scale = Math.min(this.canvas.width / img1.width, this.canvas.height / img1.height);
            this.scale = scale;

            let imgW = img1.width;
            let imgH = img1.height;
            let dx = this.canvas.width / 2 - imgW * scale / 2;
            let dy = this.canvas.height / 2 - imgH * scale / 2;

            this.drawImage(dx, dy);

        };

        const img2 = new Image();
        img2.src = image03;
        this.img2 = img2;
        img2.onload = () => {
            this.ctx2.drawImage(img2, 0, 0);
        };

        this.initEventListener();
    }
    reset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    drawImage(dx: number, dy: number) {
        let imgW = this.img1?.width!;
        let imgH = this.img1?.height!;
        console.log('dx', dx, dy, imgW * this.scale, imgH * this.scale);
        this.ctx.drawImage(this.offCanvas, dx, dy, imgW * this.scale, imgH * this.scale);

        this.originX = dx;
        this.originY = dy;
    }
    initEventListener() {
        let startX: number;
        let startY: number;
        const onMouseUp = (e: MouseEvent) => {
            this.canvas.removeEventListener('mousemove', onMouseMove);
            this.canvas.removeEventListener('mouseup', onMouseUp);
        };
        const onMouseMove = lodash.throttle((e: MouseEvent) => {
            let endX = this.mouse.x;
            let endY = this.mouse.y;

            let x1 = endX - startX;
            let y1 = endY - startY;
            let dx = this.originX + x1;
            let dy = this.originY + y1;

            console.log(x1, y1, this.mouse, this.originX, this.originY);
            this.reset();

            // this.ctx.setTransform(0, 0, 0, 0, dx, dy);
            this.drawImage(dx, dy);

            startX = endX;
            startY = endY;

        }, 10);
        const onMouseDown = (e: MouseEvent) => {
            startX = this.mouse.x;
            startY = this.mouse.y;
            this.canvas.addEventListener('mousemove', onMouseMove);
            this.canvas.addEventListener('mouseup', onMouseUp);
        };

        this.canvas.addEventListener('mousedown', onMouseDown)

        this.canvas.addEventListener('mousemove', lodash.debounce(() => {
            let rectW = 256;
            let rectH = 256;
            let eventX = this.mouse.x;
            let eventY = this.mouse.y;
            let rectX = eventX - rectW / 2;
            let rectY = eventY - rectH / 2;

            let sx = (rectX - this.originX) / this.scale;
            let sy = (rectY - this.originY) / this.scale;
            console.log(sx, sy, rectW / this.scale, rectH / this.scale, rectX, rectY, rectW * this.scale, rectH * this.scale);


            this.offCtx.drawImage(this.img2!, sx, sy, rectW / this.scale, rectH / this.scale, sx, sy, rectW / this.scale, rectH / this.scale);
            this.drawImage(this.originX, this.originY);

        }, 200));
    }
    handleScale(s: number) {
        this.reset();
        this.scale = this.scale * s;
        this.drawImage(this.originX, this.originY);

    }
}

export default ImageLoader;