const images = require("images");
const fs = require("fs");

// $`rm -rf static/images/03.jpeg`;

fs.mkdirSync("static/images/03.jpeg", { recursive: true });

let img = images("input/03.jpeg");
let width = img.width();
let height = img.height();

// 层数 = Math.ceil(Math.log2(4000/256))
let maxZoom = Math.ceil(Math.log2(width / 256)); // 4

// 计算原图要拆分成多少行，多少列
let sizeX = Math.ceil(width / 256);
let sizeY = Math.ceil(height / 256);

console.log("sizeX", width, height, sizeX);
// 计算第4层（0层base）需要拆分成多少行（X）、多少列（Y）
// 分辨率按[1,2,4,8,...] 设置，也即2的n次方
for (let z = maxZoom; z >= 0; z--) {
  let curZoom = z;
  let minX = 0;
  let maxX = Math.max(Math.ceil(sizeX / Math.pow(2, maxZoom - curZoom) - 1), 0);
  let minY = 0;
  let maxY = Math.max(Math.ceil(sizeY / Math.pow(2, maxZoom - curZoom)) - 1, 0);
  let resizeWidth = Math.min(width, (width / sizeX) * Math.pow(2, curZoom));
  console.log(z, maxX, maxY, resizeWidth);
  img.resize(resizeWidth);
  // 将每一个瓦片保存为图片
  for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
      let gx = i * 256;
      let gy = j * 256;
      let gwidth = Math.min(256, width - gx);
      let gheight = Math.min(256, height - gy);
      let gridImg = images(img, gx, gy, gwidth, gheight);
      gridImg.save(`static/images/03.jpeg/${curZoom}-${i}-${j}.jpg`, {
        quality: 100,
      });
    }
  }
}
