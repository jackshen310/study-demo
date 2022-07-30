import { nanoid } from "@reduxjs/toolkit";
import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { postAdded } from "./slice";

export const AddPostForm = (props: { onOk: Function }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(
        postAdded({
          id: nanoid(),
          title,
          content,
        })
      );

      setTitle("");
      setContent("");

      props.onOk();
    }
  };

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

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
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <br />
        <button type="button" onClick={onSavePostClicked}>
          保存帖子
        </button>
      </form>
    </section>
  );
};
