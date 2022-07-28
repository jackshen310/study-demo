import * as THREE from "three";
const R = Math.PI / 180;
class Editor {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  material: THREE.MeshBasicMaterial | undefined;
  cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | undefined;
  frameId: number | undefined;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // this.ctx = canvas.getContext("webgl")!;

    // /*
    //   设置视口 context.viewport(x, y, width, height);
    //   x: 用来设定视口的左下角水平坐标。默认值：0
    //   y: 用来设定视口的左下角垂直坐标。默认值：0
    //   width: 用来设定视口的宽度。默认值：canvas 的宽度
    //   height: 用来设定视口的高度。默认值：canvas 的高度
    //   当你第一次创建 WebGL 上下文的时候，视口的大小和 canvas 的大小是匹配的。然而，如果你重新改变了canvas的大小，你需要告诉 WebGL 上下文设定新的视口，因此这里作为初次创建这行代码可以省略
    // */
    // this.ctx.viewport(0, 0, canvas.width, canvas.height);
    this.init();
  }

  init() {}

  drawTrigle() {
    const width = 800;
    const height = 600;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const cube = new THREE.Mesh(geometry, material);

    camera.position.z = 4;
    scene.add(cube);
    renderer.setClearColor("#000000");
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = material;
    this.cube = cube;

    document.getElementById("threejs")?.appendChild(this.renderer.domElement);
    this.start();
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  animate = () => {
    if (!this.cube) return;
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    if (!this.renderer) return;
    this.renderer.render(this.scene!, this.camera!);
  };

  drawImage() {
    const width = 800;
    const height = 600;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    camera.position.z = 4;
    renderer.setClearColor("#000000");
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    document.getElementById("threejs")?.appendChild(this.renderer.domElement);

    // instantiate a loader
    const loader = new THREE.ImageBitmapLoader();

    // set options if needed
    loader.setOptions({ imageOrientation: "flipY" });

    // load a image resource
    loader.load(
      // resource URL
      "https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/e66400dc3f8b44bbb220eadf7853c862~noop.image?_iz=58558&from=article.pc_detail&x-expires=1659520293&x-signature=UMW2l6vHfoiMVn%2FpH8Coh8xzALk%3D",

      // onLoad callback
      (imageBitmap) => {
        console.log(imageBitmap);
        const texture = new THREE.CanvasTexture(imageBitmap);
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.renderScene();
      },

      // onProgress callback currently not supported
      undefined,

      // onError callback
      function (err) {
        console.log("An error happened");
      }
    );
  }
}

export default Editor;
