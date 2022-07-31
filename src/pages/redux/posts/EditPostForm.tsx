import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEditPostMutation, useGetPostQuery } from "../store/apiSlice";

export const EditPostForm = (props: { postId: string; onOk: Function }) => {
  const { postId } = props;

  const { data } = useGetPostQuery(postId);
  const post = data?.data;

  const [updatePost, { isLoading }] = useEditPostMutation();

  const users = useSelector<any, any>((state) => state.users);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (!post) return;
    setTitle(post.title);
    setContent(post.content);
    setUserId(post.userId);
  }, [post]);

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
  const onSavePostClicked = async () => {
    if (title && content) {
      // dispatch(postUpdated({ id: postId, title, content, userId }));
      await updatePost({ id: postId, title, content });
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
