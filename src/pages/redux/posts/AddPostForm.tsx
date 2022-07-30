import { nanoid } from "@reduxjs/toolkit";
import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAdded } from "./slice";

export const AddPostForm = (props: { onOk: Function }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const users = useSelector<any, any>((state) => state.users);
  const dispatch = useDispatch();

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postAdded(title, content, userId));

      setTitle("");
      setContent("");

      props.onOk();
    }
  };

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

  return (
    <section>
      <form>
        <label htmlFor="postTitle">帖子标题:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <br />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <br />
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <br />

        <button type="button" disabled={!canSave} onClick={onSavePostClicked}>
          保存帖子
        </button>
      </form>
    </section>
  );
};
