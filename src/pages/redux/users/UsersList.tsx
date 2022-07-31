import { Modal } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "./slice";
import { UserPage } from "./UserPage";

export const UsersList = () => {
  const users = useSelector(selectAllUsers);
  const [modal, contextHolder] = Modal.useModal();

  const handleClick = (userId: string) => {
    modal.info({
      title: "详情",
      content: <UserPage userId={userId} />,
    });
  };

  const renderedUsers = users.map((user: any) => (
    <li key={user.id}>
      <span
        onClick={() => {
          handleClick(user.id);
        }}
      >
        {user.name}
      </span>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>

      <ul>{renderedUsers}</ul>
      <div>{contextHolder}</div>
    </section>
  );
};
