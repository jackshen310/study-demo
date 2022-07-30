import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    // 自定义payload
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId: userId,
            date: new Date().toISOString(),
          },
          type: "posts/postAdded",
          meta: "",
          error: "",
        };
      },
    },
    postUpdated(state, action) {
      const { id, title, content, userId } = action.payload;
      const existingPost = state.posts.find((post: any) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
        existingPost.userId = userId;
        existingPost.date = new Date().toISOString();
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // We can directly add the new post object to our posts array
        state.posts.push(action.payload);
      });
  },
});

// 编写选择器，这只是一种简便写法，你也可以直接在组件使用useSelector
// 建议开始时不使用任何选择器，稍后当您发现自己在应用程序代码的许多部分中查找相同值时添加一些选择器。
export const selectAllPosts = (state: any) => state.posts.posts;

export const selectPostById = (state: any, postId: string) =>
  state.posts.posts.find((post: { id: string }) => post.id === postId);

export const { postAdded, postUpdated } = postsSlice.actions;

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          title: "1111",
          content: "111",
          userId: "1",
        },
      ]);
    }, 500);
  });
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost: object) => {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ...initialPost,
          id: nanoid(),
          date: new Date().toISOString(),
        });
      }, 2000);
    });
  }
);

export default postsSlice.reducer;
