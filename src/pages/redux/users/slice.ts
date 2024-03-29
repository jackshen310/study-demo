import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: "0", name: "Tianna Jenkins" },
  { id: "1", name: "Kevin Grant" },
  { id: "2", name: "Madison Price" },
];

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(initialState);
    }, 500);
  });
});

export const selectAllUsers = (state: any) => state.users;

export const selectUserById = (state: any, userId: string) =>
  state.users.find((user: any) => user.id === userId);

export default usersSlice.reducer;
