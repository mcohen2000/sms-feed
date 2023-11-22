"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function SubscribeForm() {
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const subscribeUser = api.user.subscribe.useMutation({
    onSuccess: () => {
      setError("");
      setIsSubmitted(true);
    },
    onError: (error) => {
      setPhone("");
      setError(error.message);
    },
  });
  function formatPhoneStr(str: string) {
    let cleaned = ("" + str).replace(/\D/g, "");

    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }

    return phone;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("SUBSCRIBE!!!", phone);
        subscribeUser.mutate({ phone: `+1${phone}` });
      }}
      className="flex flex-col gap-2"
    >
      {isSubmitted ? (
        <div className="border-2 bg-green-700">
          <p className="px-3 py-4">Successfully Subscribed!</p>
        </div>
      ) : (
        <>
          <label className="flex flex-col items-center gap-2 text-center">
            Subscribe to the SMS Feed
            <input
              type="tel"
              placeholder="(123) 456-7890"
              // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              value={formatPhoneStr(phone)}
              onChange={(e) => {
                setError("");
                setPhone(e.target.value.replace(/\D/g, ""));
              }}
              className="w-full rounded-full px-4 py-2 text-center text-black"
              required
            />
            {error ? (
              <p className="text-center text-sm text-red-600">{error}</p>
            ) : (
              <></>
            )}
            <p>*Only Available for USA Phone Numbers</p>
          </label>
          <button
            type="submit"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
            disabled={subscribeUser.isLoading}
          >
            {subscribeUser.isLoading ? "Submitting..." : "Submit"}
          </button>
        </>
      )}
    </form>
  );
}
