"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function DeletePostModal(props: {
  id: string;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [deleteInput, setDeleteInput] = useState("");
  const { id, isDeleting, setIsDeleting } = props;
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsDeleting(false);
    },
  });
  useEffect(() => {
    function handleClickOff(e: MouseEvent) {
      const targetNode = e.target as Node;
      if (modalRef.current && !modalRef.current.contains(targetNode)) {
        setIsDeleting(false);
        document.body.style.overflow = "";
      }
    }
    function onEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsDeleting(false);
        document.body.style.overflow = "";
      }
    }
    if (isDeleting) {
      document.addEventListener("mouseup", handleClickOff, true);
      document.addEventListener("keydown", onEscapeKey, true);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOff, true);
      document.removeEventListener("keydown", onEscapeKey, true);
    };
  }, [isDeleting]);
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/50">
      <div className="flex w-[500px] flex-col items-center justify-center gap-4 rounded-md bg-white p-4" ref={modalRef}>
        <div className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="fill-black hover:fill-red-500 h-6 w-6 cursor-pointer"
            onClick={() => setIsDeleting(false)}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <label htmlFor="deleteInput">Type "delete" to confirm:</label>
        <input
          id="deleteInput"
          className="border p-2 text-center"
          value={deleteInput}
          placeholder="Type here..."
          onChange={(e) => setDeleteInput(e.target.value)}
        />
        <button
          className="min-w-[72px] rounded-md border bg-red-500 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => deletePost.mutate({ id })}
          disabled={deletePost.isLoading || deleteInput !== "delete"}
        >
          {deletePost.isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
