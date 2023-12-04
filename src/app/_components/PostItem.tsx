"use client";

import { Prisma } from "@prisma/client";
import { api } from "~/trpc/react";
import { countCharacters } from "../_utils/countCharacters";
import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
type PostWithSent = Prisma.PostGetPayload<{ include: { sentTo: true } }>;

export default function PostItem(props: { post: PostWithSent }) {
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
  const textAreaRef = useRef<HTMLTextAreaElement>();
  function updateTextAreaHeight(textArea?: HTMLTextAreaElement){
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
  }
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaHeight(textArea)
    textAreaRef.current = textArea;
  }, [])
  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
  }, [text])
  return (
    <li
      className={`flex w-full flex-col items-start justify-between text-left truncate gap-4 border-b px-4 py-4`}
    >
      {isEditing ? (
        <>
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">
              Character Count: {countCharacters(text)}
            </p>
            <p className="font-semibold">
              SMS Count:{" "}
              {countCharacters(text) > 160
                ? Math.ceil(countCharacters(text) / 153)
                : 1}
            </p>
          </div>
          <textarea
            className="w-full flex-grow border px-2 py-1 hover:border-black/20"
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <span className="flex gap-1 pl-1 self-center">
            <button
              className="min-w-[72px] rounded-md border bg-green-500 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => updatePost.mutate({ id: post.id, name: text })}
              disabled={updatePost.isLoading || post.name === text}
            >
              {updatePost.isLoading ? "Saving..." : "Save"}
            </button>
            <button
              className="min-w-[72px] rounded-md border bg-red-500 px-2 py-1"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </span>
        </>
      ) : (
        <>
          <p className="w-full truncate" title={text !== post.name  ? "Updating...": post.name}>
            {text !== post.name ? "Updating...": post.name}
          </p>
          <span className="flex gap-1 pl-1 self-center">
            <button className="min-w-[72px] rounded-md border bg-green-500 px-2 py-1">
              Send
            </button>
            <button
              className="min-w-[72px] rounded-md border bg-yellow-500 px-2 py-1"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="min-w-[72px] rounded-md border bg-red-500 px-2 py-1"
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
