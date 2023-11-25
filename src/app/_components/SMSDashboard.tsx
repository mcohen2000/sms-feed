import { api } from "~/trpc/server";

export default async function Dashboard() {
  const allPosts = await api.post.getAll.query();
  return (
    <div className="w-[80%] rounded-md bg-white text-black">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-2">
        <button className="rounded-md border px-2 py-1 bg-blue-500 text-white">New</button>
        <div className="flex items-center gap-1 flex-wrap">
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
                <span className="truncate" title={post.name}>{post.name}</span>
                <span className="flex gap-1 pl-1">
                  <button className="rounded-md border bg-green-500 px-2 py-1">
                    Send
                  </button>
                  <button className="rounded-md border bg-yellow-500 px-2 py-1">
                    Edit
                  </button>
                  <button className="rounded-md border bg-red-500 px-2 py-1">
                    Delete
                  </button>
                </span>
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
