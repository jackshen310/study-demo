import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./slices";

const store = configureStore({
  reducer: counterSlice.reducer,
});

export default store;
