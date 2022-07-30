import React from "react";
import { useSelector } from "react-redux";
import { PostAuthor } from "./PostAuthor";
import { selectPostById } from "./slice";
import { TimeAgo } from "./TimeAgo";

type Props = {
  postId: string;
};
export const SinglePostPage = (props: Props) => {
  const { postId } = props;

  // 每当 useSelector 返回的值为新引用时，组件就会重新渲染。
  // 所以组件应始终尝试从 store 中选择它们需要的尽可能少的数据，这将有助于确保它仅在实际需要时才渲染。
  const post = useSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>页面未找到！</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <PostAuthor {...post} />
        <TimeAgo timestamp={post.date} />
      </article>
    </section>
  );
};
