"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function PostButtons(props: {id:string;}) {
  const router = useRouter();
  const deletePost = api.post.delete.useMutation({ onSuccess:() => {
    router.refresh();
  }})
  return (
    <span className="flex gap-1 pl-1">
      <button className="rounded-md border bg-green-500 px-2 py-1">Send</button>
      <button className="rounded-md border bg-yellow-500 px-2 py-1">
        Edit
      </button>
      <button
        className="rounded-md border bg-red-500 px-2 py-1"
        onClick={() => deletePost.mutate({id: props.id})}
        disabled={deletePost.isLoading}
      >
        {deletePost.isLoading ? "Deleting...": "Delete"}
      </button>
    </span>
  );
}
