const Koa = require("koa");
const route = require("koa-route");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
const UserDao = require("./user");
const PostsDao = require("./posts");
const { nanoid } = require("@reduxjs/toolkit");
const cors = require("@koa/cors");

const app = new Koa();
app.use(cors());
app.use(bodyParser());

app.use(
  route.get("/api/fakeApi/posts", async (ctx) => {
    const dao = new PostsDao();
    const data = await dao.query();
    ctx.body = {
      code: 200,
      data,
    };
  })
);

app.use(
  route.post("/api/fakeApi/posts", async (ctx) => {
    const params = ctx.request.body;
    const dao = new PostsDao();
    const data = {
      ...params,
      id: nanoid(),
      date: new Date().toISOString(),
    };
    await dao.save(data);

    ctx.body = {
      code: 200,
      data,
    };
  })
);

app.use(
  route.put("/api/v1/users/:code", async (ctx, code) => {
    const params = ctx.request.body;
    const dao = new UserDao();
    const data = await dao.getByCode(code);
    if (!data) {
      ctx.body = {
        code: 500,
        msg: "用户编码不存在",
      };
    } else {
      params.code = code;
      await dao.update(params);
      ctx.body = {
        code: 200,
        msg: "操作成功",
      };
    }
  })
);
app.use(
  route.del("/api/v1/users/:code", async (ctx, code) => {
    const dao = new UserDao();
    await dao.del(code);
    ctx.body = {
      code: 200,
      msg: "操作成功",
    };
  })
);

// 文件信息
app.use(
  route.get("/api/v1/files/:id/info", async (ctx, id) => {
    ctx.body = {
      code: 200,
      data: {
        fileName: "文件测试",
        fileExt: "docx",
      },
      msg: "操作成功",
    };
  })
);
// 文件预览
app.use(
  route.get("/api/v1/files/:id/preview", async (ctx, id) => {
    const fileContent = fs.readFileSync(
      path.join(__dirname, "data/AgGrid性能压测方案.html")
    );
    ctx.body = {
      code: 200,
      data: {
        fileContent: String(fileContent),
      },
      msg: "操作成功",
    };
  })
);
// 文件下载
app.use(
  route.get("/api/v1/files/:id", async (ctx, id) => {
    ctx.body = {
      code: 200,
      data: {
        fileContent: "文件测试",
      },
      msg: "操作成功",
    };
  })
);

app.listen(9991);

console.log("sample server listening on port http://127.0.0.1:9991");
