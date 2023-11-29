"use client";

import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      setName("");
      router.refresh();
    },
  });
  function countCharacters(str: String) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        count += 2;
      }
      if (str[i] !== "\n") {
        count++;
      }
    }
    return count;
  }
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
  }, [name])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name });
      }}
      className="flex w-[80%] flex-col gap-2 rounded-md bg-white p-2 text-black"
    >
      <label htmlFor="postInput" className="text-lg font-bold">
        Create Post
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
          Character Count: {countCharacters(name)}
        </p>
        <p className="font-semibold">
          SMS Count:{" "}
          {countCharacters(name) > 160
            ? Math.ceil(countCharacters(name) / 153)
            : 1}
        </p>
      </div>
      <textarea
        placeholder="Type new post here..."
        id="postInput"
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full border bg-white/10 px-10 py-3 font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed"
        disabled={createPost.isLoading || name.length <= 0}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
