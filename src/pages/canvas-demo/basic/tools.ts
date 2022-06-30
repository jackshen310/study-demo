class Tools {
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
}

export default Tools;
