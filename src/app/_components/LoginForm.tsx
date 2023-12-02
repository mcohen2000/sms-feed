"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const params = useSearchParams();
  const error = params.get("error");

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
      {error ? <p className="text-center text-red-600">Invalid Credentials</p> : null}
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black border"
      />
      <button
        type="submit"
        className="rounded-full border bg-white/10 px-10 py-3 font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed"
        disabled={!email || !password}
      >
        Submit
      </button>
    </form>
  );
}
