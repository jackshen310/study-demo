#![feature(test)]

extern crate test;
extern crate wasm;

#[bench]
fn universe_ticks(b: &mut test::Bencher) {
    let mut universe = wasm::Universe::new();

    b.iter(|| {
        universe.tick();
    });
}
