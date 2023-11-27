"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      setName("");
      router.refresh();
    }
  });
  function countCharacters(str: String){
    console.log(str, str.length)
    let count = 0;
    for (let i=0; i<str.length; i++){
      if (str[i] == '\n') {
        count += 2
      }
      
      if (str[i] != '\n') {
      count++;
      }
    }
    return count;
  }
  
  return (
    <form
    onSubmit={(e) => {
      e.preventDefault();
      createPost.mutate({ name });
      }}
      className="flex flex-col gap-2 rounded-md bg-white text-black p-2 w-[80%]"
    >
      <label htmlFor="postInput" className="text-lg font-bold">Create Post</label>
      <p>Note:</p>
      <ul className="list-disc list-inside">
        <li className="break-normal">SMS lengths are limited to 160 characters.</li>
        <li className="break-normal">An SMS longer than 160 characters are split every 153 characters with a max of 1530 characters.</li>
        <li className="break-words">Line breaks count as 2 characters.</li>
      </ul>
      <div className="flex flex-wrap justify-between items-center gap-2">
      <p className="font-semibold">Character Count: {countCharacters(name)}</p>
      <p className="font-semibold">SMS Count: {countCharacters(name)>160 ? Math.ceil(countCharacters(name)/153) : 1}</p>
      </div>
      <textarea
        placeholder="Type new post here..."
        id="postInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 text-black border"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition border hover:bg-slate-50"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
