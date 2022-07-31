import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import store from "../store";
import { EditPostForm } from "./EditPostForm";
import { PostAuthor } from "./PostAuthor";
import { SinglePostPage } from "./SinglePostPage";
import { TimeAgo } from "./TimeAgo";
import { fetchUsers } from "../users/slice";
import { useGetPostsQuery } from "../store/apiSlice";

export const PostsList = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [isShowEdit, setIsShowEdit] = useState(false);
  let curPostId = useRef("");

  const { data, isLoading, isSuccess, isError, error } = useGetPostsQuery(null);

  useEffect(() => {
    console.log("postStatus", isLoading, isSuccess);
  }, [isLoading, isSuccess]);

  useEffect(() => {
    store.dispatch(fetchUsers());
    // store.dispatch(fetchPosts());
  }, []);

  const openDetail = (id: string) => {
    modal.info({ title: "详情", content: <SinglePostPage postId={id} /> });
  };

  const handleEdit = (postId: string) => {
    curPostId.current = postId;
    setIsShowEdit(true);
  };
  const renderedPosts =
    data?.data &&
    data.data.map((post: any) => (
      <article className="post-excerpt" key={post.id}>
        <h3>{post.title}</h3>
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <PostAuthor {...post} />
        <TimeAgo timestamp={post.date} />
        <button
          onClick={() => {
            openDetail(post.id);
          }}
        >
          详情
        </button>
        <button
          onClick={() => {
            handleEdit(post.id);
          }}
        >
          修改
        </button>
      </article>
    ));

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
      <div>{contextHolder}</div>
      <Modal
        title="编辑帖子"
        footer={null}
        onCancel={() => {
          setIsShowEdit(false);
        }}
        visible={isShowEdit}
        destroyOnClose={true}
      >
        <EditPostForm
          postId={curPostId.current}
          onOk={() => {
            setIsShowEdit(false);
          }}
        />
      </Modal>
    </section>
  );
};
