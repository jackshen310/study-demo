import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../counter/slice";
import postsReducer from "../posts/slice";
import usersReducer from "../users/slice";
import notificationsReducer from "../notifications/slice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
});

export default store;
