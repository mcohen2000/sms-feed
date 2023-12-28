"use client";

import { Prisma } from "@prisma/client";
import { api } from "~/trpc/react";
import { countCharacters } from "../_utils/countCharacters";
import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import DeletePostModal from "./DeletePostModal";
import SendPostModal from "./SendPostModal";
type PostWithSent = Prisma.PostGetPayload<{
  include: { OutboundWebhook: true };
}>;

export default function PostItem(props: { post: PostWithSent }) {
  const post = props.post;
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [text, setText] = useState(post.text);
  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      router.refresh();
    },
  });
  const textAreaRef = useRef<HTMLTextAreaElement>();
  function updateTextAreaHeight(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);
  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
  }, [text]);
  return (
    <li
      className={`flex w-full flex-col items-start justify-between gap-4 border-b px-4 py-4 text-left`}
    >
      {isSending ? (
        <SendPostModal
          post={post}
          isSending={isSending}
          setIsSending={setIsSending}
        />
      ) : null}
      {isDeleting ? (
        <DeletePostModal
          id={post.id}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      ) : null}
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
          <span className="flex gap-1 self-center pl-1">
            <button
              className="min-w-[72px] rounded-md border bg-green-500 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => updatePost.mutate({ id: post.id, text: text })}
              disabled={updatePost.isLoading || post.text === text}
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
          <p
            className="line-clamp-3 w-full"
            title={text !== post.text ? "Updating..." : post.text}
          >
            {text !== post.text
              ? "Updating..."
              : post.text.includes("\n")
                ? post.text.split("\n").map((text, index) =>
                    index === post.text.split("\n").length - 1 ? (
                      <span key={index}>{text}</span>
                    ) : (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ),
                  )
                : post.text}
          </p>
          <span className="flex gap-1 self-center pl-1">
            <button
              className="min-w-[72px] rounded-md border bg-green-500 px-2 py-1"
              onClick={() => setIsSending(true)}
            >
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
              onClick={() => setIsDeleting(true)}
            >
              Delete
            </button>
          </span>
        </>
      )}
    </li>
  );
}
