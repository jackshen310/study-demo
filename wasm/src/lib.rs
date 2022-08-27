mod utils;

extern crate fixedbitset;
extern crate js_sys;
extern crate web_sys;

use crate::utils::set_panic_hook;
use fixedbitset::FixedBitSet;
use std::fmt;
use wasm_bindgen::prelude::*;
use web_sys::console;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub struct Timer<'a> {
    name: &'a str,
}

impl<'a> Timer<'a> {
    pub fn new(name: &'a str) -> Timer<'a> {
        console::time_with_label(name);
        Timer { name }
    }
}

impl<'a> Drop for Timer<'a> {
    fn drop(&mut self) {
        console::time_end_with_label(self.name);
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet,
}

#[wasm_bindgen]
impl Universe {
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }
    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                count += self.cells[idx] as u8;
            }
        }
        count
    }
    pub fn tick(&mut self) {
        let _timer = Timer::new("Universe::tick");
        let mut next = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                // let next_cell = match (cell, live_neighbors) {
                //     // Rule 1: Any live cell with fewer than two live neighbours
                //     // dies, as if caused by underpopulation.
                //     (Cell::Alive, x) if x < 2 => Cell::Dead,
                //     // Rule 2: Any live cell with two or three live neighbours
                //     // lives on to the next generation.
                //     (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
                //     // Rule 3: Any live cell with more than three live
                //     // neighbours dies, as if by overpopulation.
                //     (Cell::Alive, x) if x > 3 => Cell::Dead,
                //     // Rule 4: Any dead cell with exactly three live neighbours
                //     // becomes a live cell, as if by reproduction.
                //     (Cell::Dead, 3) => Cell::Alive,
                //     // All other cells remain in the same state.
                //     (otherwise, _) => otherwise,
                // };

                // log!(
                //     "cell[{}, {}] is initially {:?} and has {} live neighbors",
                //     row,
                //     col,
                //     cell,
                //     live_neighbors
                // );

                let next_cell = match (cell, live_neighbors) {
                    (true, x) if x < 2 => false,
                    (true, 2) | (true, 3) => true,
                    (true, x) if x > 3 => false,
                    (false, 3) => true,
                    (otherwise, _) => otherwise,
                };
                // log!("    it becomes {:?}", next_cell);

                next.set(idx, next_cell);

                // next[idx] = next_cell;
            }
        }

        self.cells = next;
    }
    pub fn new() -> Universe {
        set_panic_hook();
        let width = 128;
        let height = 128;

        // let cells = (0..width * height) // TODO 这种写法挺好的
        //     .map(|i| {
        //         // if i % 2 == 0 || i % 7 == 0 {
        //         //     Cell::Alive
        //         // } else {
        //         //     Cell::Dead
        //         // }
        //         // 随机
        //         if js_sys::Math::random() < 0.5 {
        //             Cell::Alive
        //         } else {
        //             Cell::Dead
        //         }
        //     })
        //     .collect();

        // 用位数据结构来存储
        let size = (width * height) as usize;
        let mut cells = FixedBitSet::with_capacity(size);

        for i in 0..size {
            cells.set(i, i % 2 == 0 || i % 7 == 0);
        }

        Universe {
            width,
            height,
            cells,
        }
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    // pub fn cells(&self) -> *const Cell {
    //     self.cells.as_ptr()
    // }

    // 要将指向位开头的指针传递给 JavaScript，您可以将 转换FixedBitSet为切片，然后将切片转换为指针
    pub fn cells(&self) -> *const u32 {
        self.cells.as_slice().as_ptr()
    }

    // Set the width of the universe.
    //
    // Resets all cells to the dead state.
    // pub fn set_width(&mut self, width: u32) {
    //     self.width = width;
    //     self.cells = (0..width * self.height).map(|_i| false).collect();
    // }

    // Set the height of the universe.
    //
    // Resets all cells to the dead state.
    // pub fn set_height(&mut self, height: u32) {
    //     self.height = height;
    //     self.cells = (0..self.width * height).map(|_i| false).collect();
    // }

    // Get the dead and alive values of the entire universe.
    // pub fn get_cells(&self) -> &[(u32, u32)] {
    //     &self.cells
    // }

    // /// Set cells to be alive in a universe by passing the row and column
    // /// of each cell as an array.
    // pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
    //     for (row, col) in cells.iter().cloned() {
    //         let idx = self.get_index(row, col);
    //         self.cells[idx] = Cell::Alive;
    //     }
    // }

    pub fn toggle_cell(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        let val = self.cells[idx];
        self.cells.set(idx, if val { false } else { true })
    }
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell == 0 { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}

#[wasm_bindgen]
pub fn greet() {
    // alert("Hello, wasm!");
}
