import { Modal } from "antd";
import React, { useState } from "react";
import { UsersList } from "./UsersList";

const Users = () => {
  return (
    <div style={{ marginLeft: 100 }}>
      <UsersList />
    </div>
  );
};

export default Users;
