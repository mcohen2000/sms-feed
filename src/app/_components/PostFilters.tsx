"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PostFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const sent = searchParams.get("sent");
  return (
    <div className="flex flex-wrap items-center gap-1">
      Filter:
      <input
        type="text"
        placeholder="Search"
        className="rounded-md border px-2 py-1"
        onChange={(e) => {
          if (e.target.value.length === 0) {
            if(sent){
                return router.replace(`/admin/dashboard?sent=${sent}`);

            }
            return router.replace(`/admin/dashboard`);
          }
          router.replace(sent ? `?search=${e.target.value}&sent=${sent}`:`?search=${e.target.value}`);
        }}
      />
      <div className="flex gap-1">
      <button
        className={`rounded-md border px-2 py-1 ${sent === "true" ? "bg-blue-500 text-white":""}`}
        onClick={() => {
            if (search && search?.length > 0) {
                if (sent === "true") {
                    return router.replace(`?search=${search}`);
                }
                if (sent === "false" || !sent) {
                    return router.replace(`?search=${search}&sent=true`);
                }
            }
            if (sent === "true") {
                return router.replace(`/admin/dashboard`);
            }
            return router.replace(`?sent=true`);
        }}
        >
        Sent
      </button>
      <button className={`rounded-md border px-2 py-1 ${sent === "false" ? "bg-blue-500 text-white":""}`} onClick={() => {
          if (search && search?.length > 0) {
              if (sent === "false") {
                  return router.replace(`?search=${search}`);
                }
                if (sent === "true" || !sent) {
                    return router.replace(`?search=${search}&sent=false`);
                }
            }
            if (sent === "false") {
                return router.replace(`/admin/dashboard`);
            }
            return router.replace(`?sent=false`);
        }}>Unsent</button>
        </div>
    </div>
  );
}
