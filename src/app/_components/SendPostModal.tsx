"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { countCharacters } from "../_utils/countCharacters";

type PostWithSent = Prisma.PostGetPayload<{ include: { sentTo: true } }>;

export default function SendPostModal(props: {
  post: PostWithSent;
  isSending: boolean;
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [sendInput, setSendInput] = useState("");
  const { post, isSending, setIsSending } = props;
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const sendPost = api.post.send.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsSending(false);
      document.body.classList.remove("overflow-y-hidden");
    },
  });
  useEffect(() => {
    function handleClickOff(e: MouseEvent) {
      const targetNode = e.target as Node;
      if (modalRef.current && !modalRef.current.contains(targetNode)) {
        setIsSending(false);
        document.body.classList.remove("overflow-y-hidden");
      }
    }
    function onEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsSending(false);
        document.body.classList.remove("overflow-y-hidden");
      }
    }
    if (isSending) {
      document.body.classList.add("overflow-y-hidden");
      document.addEventListener("mouseup", handleClickOff, true);
      document.addEventListener("keydown", onEscapeKey, true);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOff, true);
      document.removeEventListener("keydown", onEscapeKey, true);
    };
  }, [isSending]);
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/50">
      <div
        className="flex w-[500px] flex-col items-center justify-center gap-4 rounded-md bg-white p-4"
        ref={modalRef}
      >
        <div className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6 cursor-pointer fill-black hover:fill-red-500"
            onClick={() => {
              setIsSending(false);
              document.body.classList.remove("overflow-y-hidden");
            }}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">
              Character Count: {countCharacters(post.text)}
            </p>
            <p className="font-semibold">
              SMS Count:{" "}
              {countCharacters(post.text) > 160
                ? Math.ceil(countCharacters(post.text) / 153)
                : 1}
            </p>
          </div>
          <div className="w-full">
            <p className="font-semibold">Text:</p>
            <div className="flex flex-col gap-3 border px-2 py-1">
              {post.text.split("\n").map((text, index) => (
                <p className="whitespace-normal" key={index}>{text}</p>
              ))}
            </div>
          </div>
        </div>
        <label htmlFor="sendInput">Type "send" to confirm:</label>
        <input
          id="sendInput"
          className="border p-2 text-center"
          value={sendInput}
          placeholder="Type here..."
          onChange={(e) => setSendInput(e.target.value)}
        />
        <button
          className="min-w-[72px] rounded-md border bg-green-500 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => sendPost.mutate({ id: post.id })}
          disabled={sendPost.isLoading || sendInput !== "send"}
        >
          {sendPost.isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
