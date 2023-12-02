"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      router.push('/');
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createUser.mutate({ first_name: firstName, last_name: lastName, email, password });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black border"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black border"
      />
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
        disabled={createUser.isLoading || !firstName || !lastName || !email || !password}
      >
        {createUser.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
