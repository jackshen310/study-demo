import { Modal } from "antd";
import React, { useState } from "react";
import { AddPostForm } from "./AddPostForm";
import { PostsList } from "./PostsList";

const Posts = () => {
  const [isShowAdd, setIsShowAdd] = useState(false);

  const handleAdd = () => {
    setIsShowAdd(true);
  };

  return (
    <div style={{ marginLeft: 100 }}>
      <button onClick={handleAdd}>添加帖子</button>
      <br />
      <PostsList />
      <Modal
        title="添加帖子"
        footer={null}
        onCancel={() => {
          setIsShowAdd(false);
        }}
        visible={isShowAdd}
      >
        <AddPostForm
          onOk={() => {
            setIsShowAdd(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Posts;
