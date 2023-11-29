import { api } from "~/trpc/server";
import PostItem from "./PostItem";
import PostFilters from "./PostFilters";


export default async function Dashboard() {
  const allPosts = await api.post.getAll.query();
  return (
    <div className="w-[80%] rounded-md bg-white text-black">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-2">
        <h2 className="text-lg font-bold">Post Manager</h2>
        <PostFilters/>
      </div>

      <ul className="flex flex-col">
        {allPosts ? (
          allPosts.map((post) => {
            return (
              <PostItem key={post.id} post={post}/>
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
