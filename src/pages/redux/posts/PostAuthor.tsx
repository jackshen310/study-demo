import React from "react";
import { useSelector } from "react-redux";

export const PostAuthor = (props: { userId: string }) => {
  const { userId } = props;
  const author = useSelector<any, any>((state) =>
    state.users.find((user: any) => user.id === userId)
  );

  return <span>by {author ? author.name : "Unknown author"}</span>;
};
