
import image01 from '../images/03.jpeg'; // 原图
import _image01 from '../images/04.jpeg'; // 压缩图
import image02 from '../images/Image_20220621160425059.bmp'; // 原图
import _image02 from '../images/Image_20220621160425059.jpg'; // 压缩图
import './tools'
import lodash from 'lodash';

class ImageLoader {
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    offCanvas: HTMLCanvasElement
    offCtx: CanvasRenderingContext2D
    mouse: { x: number; y: number } = { x: 0, y: 0 }
    dx = 0
    dy = 0
    scale = 0
    img1: HTMLImageElement | null = null
    img2: HTMLImageElement | null = null
    stag: Array<string> = []
    images: Array<string[]> = [];
    curImage: Array<string> = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;


        this.offCanvas = document.createElement('canvas');
        this.offCtx = this.offCanvas.getContext('2d')!;

        this.mouse = (window as any).tools.getMouse(canvas);
        this.addImage();
        this.init();
        this.initEventListener();
    }
    init() {
        const img1 = new Image();
        img1.src = this.curImage[1];
        img1.onload = () => {
            this.offCanvas.width = img1.width;
            this.offCanvas.height = img1.height;
            this.offCtx.drawImage(img1, 0, 0);

            let scale = Math.min(this.canvas.width / img1.width, this.canvas.height / img1.height);
            this.scale = scale;


            this.dx = this.canvas.width / 2 - img1.width * scale / 2;
            this.dy = this.canvas.height / 2 - img1.height * scale / 2;

            this.drawImage();

            this.img1 = img1;
        };
        img1.onerror = (e) => {
            console.log(e);
        }

        const img2 = new Image();
        img2.src = this.curImage[0];
        this.img2 = img2;
        img2.onerror = (e) => {
            console.log(e);
        }
    }
    setImage(index: number) {
        this.curImage = this.images[index];
        this.init();
    }
    addImage() {
        this.images.push([image01, _image01]);
        this.images.push([image02, _image02]);

        this.curImage = this.images[0];
    }
    reset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    drawImage() {
        let width = this.offCanvas.width;
        let height = this.offCanvas.height;
        this.ctx.drawImage(this.offCanvas, this.dx, this.dy, width * this.scale, height * this.scale);
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
            this.dx = this.dx + x1;
            this.dy = this.dy + y1;

            this.reset();

            this.drawImage();

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

            let imgX = (eventX - this.dx) / this.scale;
            let imgY = (eventY - this.dy) / this.scale;

            let num = Math.ceil(Math.max(1, Math.floor(1 / this.scale)) / 2);
            let indexX = Math.ceil(imgX / rectW);
            let indexY = Math.ceil(imgY / rectH);
            if (isNaN(indexX)) {
                return;
            }
            let flag = false;
            for (let i = -num; i < num; i++) {
                for (let j = -num; j < num; j++) {
                    let x = indexX + i;
                    let y = indexY + j;
                    if (x < 0 || y < 0) {
                        continue;
                    }
                    let index = (x) + '-' + (y);
                    if (this.stag.includes(index)) {
                        // console.log('缓存已经有啦！', this.stag);
                    } else {
                        console.log('缓存没有哦', this.stag);
                        flag = true;
                        let sx = (x) * rectW;
                        let sy = (y) * rectH;

                        this.offCtx.drawImage(this.img2!, sx, sy, rectW, rectH, sx, sy, rectW, rectH);

                        this.stag.push(index);
                    }
                }

            }
            flag && this.drawImage();

        }, 50));
    }
    handleScale(scale: number) {
        this.reset();
        this.scale = this.scale * scale;
        this.drawImage();
    }
}

export default ImageLoader;