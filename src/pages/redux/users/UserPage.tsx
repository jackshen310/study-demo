import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectUserById } from "./slice";
import { selectAllPosts } from "../posts/slice";

export const UserPage = (props: { userId: string }) => {
  const { userId } = props;

  const user = useSelector((state) => selectUserById(state, userId));

  const postsForUser = useSelector((state) => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter((post: any) => post.userId === userId);
  });

  const postTitles = postsForUser.map((post: any) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  );
};
