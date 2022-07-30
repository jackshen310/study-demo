import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { postUpdated } from "./slice";

export const EditPostForm = (props: { postId: string; onOk: Function }) => {
  const { postId } = props;

  const post = useSelector<any, any>((state) =>
    state.posts.find((post: any) => post.id === postId)
  );

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const dispatch = useDispatch();

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({ id: postId, title, content }));
      props.onOk();
    }
  };

  return (
    <section>
      <form>
        <label htmlFor="postTitle">帖子标题：</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        保存帖子
      </button>
    </section>
  );
};
