import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../counter/slice";
import postsReducer from "../posts/slice";
import usersReducer from "../users/slice";
import notificationsReducer from "../notifications/slice";
import { apiSlice } from "./apiSlice";
import loggerMiddleware from "./middleware/logger";
import monitorReducerEnhancer from "./enhancers/monitorReducer";
import { compose } from "redux";

const composedEnhancers = compose(monitorReducerEnhancer);

const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // enhancers: [composedEnhancers],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, loggerMiddleware),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
