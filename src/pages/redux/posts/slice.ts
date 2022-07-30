import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const initialState = [
  {
    id: "1",
    title: "First Post!",
    content: "Hello!",
    userId: "0",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
  },
  {
    id: "2",
    title: "Second Post",
    content: "More text",
    userId: "1",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
  },
];

const postsSlice = createSlice({
  name: "posts",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    // 自定义payload
    postAdded: {
      reducer(state, action) {
        state.push(action.payload);
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
      const existingPost = state.find((post: any) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
        existingPost.userId = userId;
        existingPost.date = new Date().toISOString();
      }
    },
  },
});

export const { postAdded, postUpdated } = postsSlice.actions;

export default postsSlice.reducer;
