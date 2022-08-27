import { useEffect, useState, useMemo } from "react";
import * as wasm from "wasm-game-of-life";
// Import the WebAssembly memory at the top of the file.
import { memory } from "wasm-game-of-life/wasm_bg.wasm";
import FPS from "./fps";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const WasmDemo = () => {
  // const [textContent, setTextContent] = useState("");
  const universe = useMemo(() => wasm.Universe.new(), []);

  const onClick = () => {
    // universe.tick();
    //setTextContent(universe.render());
  };

  useEffect(() => {
    if (!universe) {
      return;
    }
    // Construct the universe, and get its width and height.
    // const universe = wasm.Universe.new();
    const width = universe.width();
    const height = universe.height();
    // Give the canvas room for all of our cells and a 1px border
    // around each of them.
    const canvas = document.getElementById(
      "game-of-life-canvas"
    ) as HTMLCanvasElement;
    canvas.height = (CELL_SIZE + 1) * height + 1;
    canvas.width = (CELL_SIZE + 1) * width + 1;

    const ctx = canvas.getContext("2d")!;

    const fps = new FPS();
    const renderLoop = () => {
      fps.render(); //new
      universe.tick();

      drawGrid(ctx, width, height);
      drawCells(ctx, width, height);

      requestAnimationFrame(renderLoop);
    };

    canvas.addEventListener("click", (event) => {
      const boundingRect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / boundingRect.width;
      const scaleY = canvas.height / boundingRect.height;

      const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
      const canvasTop = (event.clientY - boundingRect.top) * scaleY;

      const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
      const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

      universe.toggle_cell(row, col);

      drawGrid(ctx, width, height);
      drawCells(ctx, width, height);
    });

    renderLoop();
  }, [universe]);

  const getIndex = (row: number, column: number, width: number) => {
    return row * width + column;
  };
  const bitIsSet = (n: number, arr: Uint8Array) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << n % 8;
    return (arr[byte] & mask) === mask;
  };

  const drawCells = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const cellsPtr = universe.cells();
    // 使用webassembly内存，构造Unit8Array对象，这样cells直接指向wasm内存，js就无需创建内存了
    const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col, width);

        // ctx.fillStyle =
        //   cells[idx] === wasm.Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

        // This is updated!
        ctx.fillStyle = bitIsSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;

        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    ctx.stroke();
  };

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
  };
  return (
    <div>
      <div id="fps"></div>
      <button onClick={onClick}>clickMe</button>
      <br />
      <canvas id="game-of-life-canvas"></canvas>
    </div>
  );
};

export default WasmDemo;
