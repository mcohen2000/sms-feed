"use client";

import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { api } from "~/trpc/react";
import { countCharacters } from "../_utils/countCharacters";

export default function WelcomeMessage(props: { post: Post | null }) {
  const router = useRouter();
  const post = props.post;
  const [text, setText] = useState(post ? post.text : "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      setText("");
      router.refresh();
    },
  });
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
  return post === null ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ text, isWelcomeMsg: true });
      }}
      className="flex w-full flex-col gap-2 rounded-md bg-white p-4 text-black"
    >
      <label htmlFor="welcomeMsgInput" className="text-lg font-bold">
        Set Welcome Message
      </label>

      <p>Note:</p>
      <ul className="list-inside list-disc">
        <li className="break-normal">
          SMS lengths are limited to 160 characters.
        </li>
        <li className="break-normal">
          An SMS longer than 160 characters are split every 153 characters with
          a max of 1530 characters.
        </li>
        <li className="break-words">Line breaks count as 2 characters.</li>
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-2">
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
        placeholder="Type welcome message here..."
        id="welcomeMsgInput"
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full border bg-white/10 px-10 py-3 font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed"
        disabled={createPost.isLoading || text.length <= 0}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  ) : (
    <div className="flex w-full flex-col gap-2 rounded-md bg-white p-4 text-black">
      {isEditing ? (
        <>
        <div className="flex justify-between items-center">

          <label htmlFor="welcomeMsgInput" className="text-lg font-bold">
            Edit Welcome Message
          </label>
          <button className="rounded-md border px-2 py-1 bg-red-500" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">
          Character Count: {countCharacters(!text && post.text ? post.text : text)}
        </p>
        <p className="font-semibold">
          SMS Count:{" "}
          {countCharacters( !text && post.text ? post.text : text) > 160
            ? Math.ceil(countCharacters(!text && post.text ? post.text : text) / 153)
            : 1}
        </p>
      </div>
          <textarea
            placeholder="Type welcome message here..."
            id="welcomeMsgInput"
            ref={inputRef}
            value={text || post.text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border px-4 py-2 text-black"
          />
          <button
            className="rounded-full border bg-white/10 px-10 py-3 font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed"
            onClick={() => updatePost.mutate({ id: post.id, text: text })}
            disabled={
              updatePost.isLoading || post.text === text || text.length === 0
            }
          >
            {updatePost.isLoading ? "Submitting..." : "Submit"}
          </button>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Welcome Message</p>
            <button className="rounded-md border px-2 py-1" onClick={() => setIsEditing(true)}>Edit</button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">
          Character Count: {countCharacters(!text && post.text ? post.text : text)}
        </p>
        <p className="font-semibold">
          SMS Count:{" "}
          {countCharacters(!text && post.text ? post.text : text) > 160
            ? Math.ceil(countCharacters(!text && post.text ? post.text : text) / 153)
            : 1}
        </p>
      </div>
          {post.text.split("\n").map((text, index) => <p key={`welcomeText-${index}`}>{text}</p>)}
        </>
      )}
    </div>
  );
}
