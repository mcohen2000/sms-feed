"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PostFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const sent = searchParams.get("sent");
  const [searchInput, setSearchInput] = useState(search || "");
  return (
    <div className="flex flex-row flex-wrap items-center gap-1">
      <form className="flex flex-wrap items-center gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (searchInput.length === 0) {
            if (sent) {
              return router.push(`/admin/dashboard?sent=${sent}`);
            }
            return router.push(`/admin/dashboard`);
          }
          router.push(
            sent
              ? `?search=${searchInput}&sent=${sent}`
              : `?search=${searchInput}`,
          );
        }}
      >
        <label htmlFor="searchInput">Filter:</label>
        <input
          type="text"
          placeholder="Search"
          id="searchInput"
          className="rounded-md border px-2 py-1"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <button className="rounded-md border px-2 py-1 bg-blue-500 text-white" type="submit">Submit</button>
      </form>
      <div className="flex gap-1">
        <button
          className={`rounded-md border px-2 py-1 ${
            sent === "true" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => {
            if (search && search?.length > 0) {
              if (sent === "true") {
                return router.push(`?search=${search}`);
              }
              if (sent === "false" || !sent) {
                return router.push(`?search=${search}&sent=true`);
              }
            }
            if (sent === "true") {
              return router.push(`/admin/dashboard`);
            }
            return router.push(`?sent=true`);
          }}
        >
          Sent
        </button>
        <button
          className={`rounded-md border px-2 py-1 ${
            sent === "false" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => {
            if (search && search?.length > 0) {
              if (sent === "false") {
                return router.push(`?search=${search}`);
              }
              if (sent === "true" || !sent) {
                return router.push(`?search=${search}&sent=false`);
              }
            }
            if (sent === "false") {
              return router.push(`/admin/dashboard`);
            }
            return router.push(`?sent=false`);
          }}
        >
          Unsent
        </button>
      </div>
    </div>
  );
}
