import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../counter/slice";
import postsReducer from "../posts/slice";
import usersReducer from "../users/slice";
import notificationsReducer from "../notifications/slice";
import { apiSlice } from "./apiSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
