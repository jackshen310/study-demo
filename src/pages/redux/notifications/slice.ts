import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState());
    const [latestNotification] = allNotifications;
    const latestTimestamp = latestNotification ? latestNotification.date : "";
    return new Promise<any>((resolve) => {
      resolve([
        {
          date: new Date().toISOString(),
          user: "1",
          name: "test111",
          message: "message111",
        },
        {
          date: new Date().toISOString(),
          user: "2",
          name: "test222",
          message: "message222",
        },
      ]);
    });
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    allNotificationsRead(state, action) {
      state.forEach((notification: any) => {
        notification.read = true;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.fulfilled, (state: any, action: any) => {
        state.forEach((notification: any) => {
          // Any notifications we've read are no longer new
          notification.isNew = true;
        });
        console.log("state", state);
        state.push(...action.payload);
        // Sort with newest first
        state.sort((a: any, b: any) => b.date.localeCompare(a.date));
      })
      .addCase(fetchNotifications.rejected, (state: any, action: any) => {
        console.log("error");
      });
  },
});

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const selectAllNotifications = (state: any) => state.notifications;
