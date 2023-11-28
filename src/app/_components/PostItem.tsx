"use client";

import { Post } from "@prisma/client";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostItem(props: { post: Post }) {
  const post = props.post;
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(post.name);
  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      router.refresh();
    },
  });
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <li className="flex w-full items-center justify-between border-b px-2 py-4">
      {isEditing ? (
        <>
          <textarea className="w-full flex-grow hover:border-black/20 border px-2 py-1" value={text} onChange={(e) => setText(e.target.value)} />
          <span className="flex gap-1 pl-1">
            <button className="rounded-md border bg-green-500 px-2 py-1" onClick={() => updatePost.mutate({id: post.id, name: text})}
            disabled={updatePost.isLoading}>
              {updatePost.isLoading ? "Saving..." : "Save"}
            </button>
            <button
              className="rounded-md border bg-red-500 px-2 py-1"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </span>
        </>
      ) : (
        <>
          <span className="truncate" title={text}>
            {text}
          </span>
          <span className="flex gap-1 pl-1">
            <button className="rounded-md border bg-green-500 px-2 py-1">
              Send
            </button>
            <button
              className="rounded-md border bg-yellow-500 px-2 py-1"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="rounded-md border bg-red-500 px-2 py-1"
              onClick={() => deletePost.mutate({ id: post.id })}
              disabled={deletePost.isLoading}
            >
              {deletePost.isLoading ? "Deleting..." : "Delete"}
            </button>
          </span>
        </>
      )}
    </li>
  );
}
