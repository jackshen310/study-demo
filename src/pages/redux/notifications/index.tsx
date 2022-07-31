import React from "react";
import { NotificationsList } from "./NotificationsList";
import { useEffect } from "react";
import store from "../store";
import { fetchNotifications } from "./slice";

const Notifications = () => {
  useEffect(() => {
    store.dispatch(fetchNotifications());
  });
  return (
    <div style={{ marginLeft: 100 }}>
      <button
        onClick={() => {
          store.dispatch(fetchNotifications());
        }}
      >
        refresh
      </button>
      <NotificationsList />
    </div>
  );
};

export default Notifications;
