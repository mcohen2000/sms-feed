"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    signIn("credentials", {
      email: email, password: password, redirect: true,
      callbackUrl: '/'
    })
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        loginUser();
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        // disabled={createUser.isLoading}
      >
        Submit
      </button>
    </form>
  );
}
