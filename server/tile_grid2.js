const Promise = require("bluebird");
const fs = require("fs");
const gm = require("gm").subClass({ imageMagick: "7+" });
Promise.promisifyAll(gm.prototype);

async function run() {
  let imgFile = "03.jpeg";
  let TILE_SIZE = 512;

  fs.mkdirSync(`static/images/${imgFile}`, { recursive: true });

  let img = gm(`input/${imgFile}`);
  let { width, height } = await img.sizeAsync();

  // 层数 = Math.ceil(Math.log2(4000/256))
  let maxZoom = Math.ceil(Math.log2(width / TILE_SIZE)); // 4

  // 计算原图要拆分成多少行，多少列
  let sizeX = Math.ceil(width / TILE_SIZE);
  let sizeY = Math.ceil(height / TILE_SIZE);

  console.log("sizeX", width, height, sizeX);

  // 计算第4层（0层base）需要拆分成多少行（X）、多少列（Y）
  // 分辨率按[1,2,4,8,...] 设置，也即2的n次方
  for (let z = maxZoom; z >= 0; z--) {
    let curZoom = z;
    let minX = 0;
    let maxX = Math.max(
      Math.ceil(sizeX / Math.pow(2, maxZoom - curZoom) - 1),
      0
    );
    let minY = 0;
    let maxY = Math.max(
      Math.ceil(sizeY / Math.pow(2, maxZoom - curZoom)) - 1,
      0
    );

    let resizeWidth = (width / sizeX) * (maxX + 1);

    console.log(z, maxX, maxY, resizeWidth);
    img.resize(resizeWidth);
    // 将每一个瓦片保存为图片
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        let gx = i * TILE_SIZE;
        let gy = j * TILE_SIZE;
        let gwidth = Math.min(TILE_SIZE, width - gx);
        let gheight = Math.min(TILE_SIZE, height - gy);
        let gridImg = img.crop(gwidth, gheight, gx, gy);
        await gridImg.writeAsync(
          `static/images/${imgFile}/${curZoom}-${i}-${j}.jpg`
        );
        img.resize(resizeWidth);
      }
    }
  }
}
try {
  run();
} catch (e) {
  console.error(e);
}
