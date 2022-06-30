export type Mouse = {
  x: number;
  y: number;
};
class Tools {
  static __mouse: Mouse;
  /**
   *
   * @returns 获取随机颜色
   */
  getRandomColor() {
    return (
      "#" +
      (function fn(color): string {
        return (color += "0123456789abcdef"[Math.floor(Math.random() * 16)]) &&
          // eslint-disable-next-line no-caller
          color.length === 6
          ? color
          : fn(color);
      })("")
    );
  }
  /**
   * 绘制圆角矩形
   * @param ctx
   * @param width
   * @param height
   * @param r
   * @param sx
   * @param sy
   */
  createRounderRect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    r: number,
    sx: number,
    sy: number
  ) {
    ctx.beginPath();
    ctx.moveTo(sx + r, sy);
    ctx.lineTo(sx + width - r, sy);
    ctx.arcTo(sx + width, sy, sx + width, sy + r, r);
    ctx.lineTo(sx + width, sy + height - r);
    ctx.arcTo(sx + width, sy + height, sx + width - r, sy + height, r);
    ctx.lineTo(sx + r, sy + height);
    ctx.arcTo(sx, sy + height, sx, sy + height - r, r);
    ctx.lineTo(sx, sy + r);
    ctx.arcTo(sx, sy, sx + r, sy, r);
    ctx.closePath();
  }

  /**
   * 获取鼠标坐标
   * @param element
   * @returns
   */
  getMouse(element: HTMLElement): Mouse {
    if (Tools.__mouse) {
      return Tools.__mouse;
    }
    const mouse = { x: 0, y: 0 };

    element.addEventListener(
      "mousemove",
      function (e) {
        let x, y;
        e = e || window.event;
        if (e.pageX || e.pageY) {
          x = e.pageX;
          y = e.pageY;
        } else {
          x =
            e.clientX +
            document.body.scrollLeft +
            document.documentElement.scrollLeft;
          y =
            e.clientY +
            document.body.scrollTop +
            document.documentElement.scrollTop;
        }
        x -= element.offsetLeft;
        y -= element.offsetTop;

        mouse.x = x;
        mouse.y = y;
      },
      false
    );

    Tools.__mouse = mouse;
    return mouse;
  }
}

export default Tools;
