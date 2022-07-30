import { nanoid } from "@reduxjs/toolkit";
import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../store";
import { postAdded, addNewPost } from "./slice";

export const AddPostForm = (props: { onOk: Function }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const users = useSelector<any, any>((state) => state.users);
  const dispatch = useDispatch();

  const onSavePostClicked = async () => {
    if (title && content) {
      try {
        /**
         *  Redux Toolkit 向返回的 Promise 添加了一个 .unwrap() 函数，
         * 它将返回一个新的 Promise，
         * 这个 Promise 在 fulfilled 状态时返回实际的 action.payload 值，
         * 或者在 “rejected” 状态下抛出错误。
         * 这让我们可以使用正常的“try/catch”逻辑处理组件中的成功和失败。
         */
        await store.dispatch(addNewPost({ title, content, userId })).unwrap();

        setTitle("");
        setContent("");

        props.onOk();
      } catch (e) {
        console.log("error", e);
      }
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
