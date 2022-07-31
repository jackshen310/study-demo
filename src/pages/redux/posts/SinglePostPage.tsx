import React from "react";
import { useSelector } from "react-redux";
import { useGetPostQuery } from "../store/apiSlice";
import { PostAuthor } from "./PostAuthor";
import { selectPostById } from "./slice";
import { TimeAgo } from "./TimeAgo";

type Props = {
  postId: string;
};
export const SinglePostPage = (props: Props) => {
  const { postId } = props;
  const { data, isFetching, isSuccess } = useGetPostQuery(postId);

  if (!data) {
    return (
      <section>
        <h2>页面未找到！</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{data.data.title}</h2>
        <p className="post-content">{data.data.content}</p>
        <PostAuthor {...data.data} />
        <TimeAgo timestamp={data.data.date} />
      </article>
    </section>
  );
};
