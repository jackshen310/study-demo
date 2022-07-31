import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";

import { selectAllUsers } from "../users/slice";
import { allNotificationsRead, selectAllNotifications } from "./slice";

export const NotificationsList = () => {
  const notifications = useSelector(selectAllNotifications);
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allNotificationsRead(true));
  }, [dispatch]);

  const renderedNotifications = notifications.map((notification: any) => {
    const date = parseISO(notification.date);
    const timeAgo = formatDistanceToNow(date);
    const user: any = users.find(
      (user: any) => user.id === notification.user
    ) || {
      name: "Unknown User",
    };

    return (
      <div key={notification.id} className="notification">
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
        <div>isNew: {`${notification.isNew}`}</div>
      </div>
    );
  });

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  );
};
