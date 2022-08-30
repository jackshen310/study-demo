# 自定义README
例子参考：https://rustwasm.github.io/docs/book/game-of-life/setup.html

build wasm: `cd wasm && wasm-pack build`

在设计 WebAssembly 和 JavaScript 之间的接口时，我们希望针对以下属性进行优化：

最大限度地减少复制进出 WebAssembly 线性内存。 不必要的副本会带来不必要的开销。

最小化序列化和反序列化。与副本类似，序列化和反序列化也会产生开销，并且通常也会产生复制。如果我们可以将不透明的句柄传递给数据结构——而不是在一侧对其进行序列化，将其复制到 WebAssembly 线性内存中的某个已知位置，然后在另一侧进行反序列化——我们通常可以减少很多开销。wasm_bindgen帮助我们定义和使用 JavaScriptObject或盒装 Rust 结构的不透明句柄。

作为一般的经验法则，一个好的 JavaScript↔WebAssembly 接口设计通常是这样一种设计，其中大型、长寿命的数据结构被实现为 Rust 类型，这些类型存在于 WebAssembly 线性内存中，并作为不透明的句柄暴露给 JavaScript。JavaScript 调用导出的 WebAssembly 函数，这些函数采用这些不透明的句柄、转换它们的数据、执行繁重的计算、查询数据并最终返回一个小的、可复制的结果。通过只返回小的计算结果，我们避免了在 JavaScript 垃圾收集堆和 WebAssembly 线性内存之间来回复制和/或序列化所有内容。


使用nightly： https://debugah.com/rust-encountered-errore0554-feature-may-not-be-used-on-the-stable-release-channel-switch-nightly-version-18060/

执行bench：rustup run nightly cargo bench | tee before.txt   （但是在mac上无法分析）


<div align="center">

  <h1><code>wasm-pack-template</code></h1>

  <strong>A template for kick starting a Rust and WebAssembly project using <a href="https://github.com/rustwasm/wasm-pack">wasm-pack</a>.</strong>

  <p>
    <a href="https://travis-ci.org/rustwasm/wasm-pack-template"><img src="https://img.shields.io/travis/rustwasm/wasm-pack-template.svg?style=flat-square" alt="Build Status" /></a>
  </p>

  <h3>
    <a href="https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/index.html">Tutorial</a>
    <span> | </span>
    <a href="https://discordapp.com/channels/442252698964721669/443151097398296587">Chat</a>
  </h3>

  <sub>Built with 🦀🕸 by <a href="https://rustwasm.github.io/">The Rust and WebAssembly Working Group</a></sub>
</div>

## About

[**📚 Read this template tutorial! 📚**][template-docs]

This template is designed for compiling Rust libraries into WebAssembly and
publishing the resulting package to NPM.

Be sure to check out [other `wasm-pack` tutorials online][tutorials] for other
templates and usages of `wasm-pack`.

[tutorials]: https://rustwasm.github.io/docs/wasm-pack/tutorials/index.html
[template-docs]: https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/index.html

## 🚴 Usage

### 🐑 Use `cargo generate` to Clone this Template

[Learn more about `cargo generate` here.](https://github.com/ashleygwilliams/cargo-generate)

```
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name my-project
cd my-project
```

### 🛠️ Build with `wasm-pack build`

```
wasm-pack build
```

### 🔬 Test in Headless Browsers with `wasm-pack test`

```
wasm-pack test --headless --firefox
```

### 🎁 Publish to NPM with `wasm-pack publish`

```
wasm-pack publish
```

## 🔋 Batteries Included

* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for communicating
  between WebAssembly and JavaScript.
* [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook)
  for logging panic messages to the developer console.
* [`wee_alloc`](https://github.com/rustwasm/wee_alloc), an allocator optimized
  for small code size.
* `LICENSE-APACHE` and `LICENSE-MIT`: most Rust projects are licensed this way, so these are included for you

## License

Licensed under either of

* Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
* MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally
submitted for inclusion in the work by you, as defined in the Apache-2.0
license, shall be dual licensed as above, without any additional terms or
conditions.