import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../counter/slice";
import postsReducer from "../posts/slice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postsReducer,
  },
});

export default store;
