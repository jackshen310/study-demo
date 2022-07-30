import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { postUpdated, selectPostById } from "./slice";

export const EditPostForm = (props: { postId: string; onOk: Function }) => {
  const { postId } = props;

  const post = useSelector((state) => selectPostById(state, postId));

  const users = useSelector<any, any>((state) => state.users);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [userId, setUserId] = useState(post.userId);

  const dispatch = useDispatch();

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  const onAuthorChanged = (e: ChangeEvent<any>) => setUserId(e.target.value);

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

  const usersOptions = users.map((user: any) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));
  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({ id: postId, title, content, userId }));
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
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" disabled={!canSave} onClick={onSavePostClicked}>
        保存帖子
      </button>
    </section>
  );
};
