import { api } from "~/trpc/server";
import Link from "next/link";
import PostButtons from "./PostButtons";

export default async function Dashboard() {
  const allPosts = await api.post.getAll.query();
  return (
    <div className="w-[80%] rounded-md bg-white text-black">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-2">
        <Link href={"/admin/dashboard/new"}>
          <button className="rounded-md border bg-blue-500 px-2 py-1 text-white">
            New
          </button>
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          Filter:
          <input
            type="text"
            placeholder="Search"
            className="rounded-md border px-2 py-1"
          />
          <button className="rounded-md border px-2 py-1">Sent</button>
          <button className="rounded-md border px-2 py-1">Unsent</button>
        </div>
      </div>

      <ul className="flex flex-col">
        {allPosts ? (
          allPosts.map((post) => {
            return (
              <li
                key={post.id}
                className="flex w-full items-center justify-between border-b px-2 py-4"
              >
                <span className="truncate" title={post.name}>
                  {post.name}
                </span>
                <PostButtons id={post.id}/>
              </li>
            );
          })
        ) : (
          <li>Loading Posts...</li>
        )}
      </ul>
      <div className="flex items-center justify-center gap-6 py-2">
        {/* pagination nav */}
        {/* <span>Prev</span> */}
        <span>{allPosts.length} Posts</span>
        {/* <span>X-Y of {allPosts.length}</span> */}
        {/* <span>Next</span> */}
      </div>
    </div>
  );
}
