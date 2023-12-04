import { api } from "~/trpc/server";
import PostItem from "./PostItem";
import PostFilters from "./PostFilters";
import Link from "next/link";

export default async function Dashboard(searchParams: {
  [key: string]: string | undefined;
}) {
  const allPosts = await api.post.getAll.query({
    search: searchParams.search || "",
    sent: searchParams.sent || "",
    page: searchParams.page || "",
  });
  const postsCount = await api.post.count.query({
    search: searchParams.search || "",
    sent: searchParams.sent || "",
  });
  return (
    <div className="w-full rounded-md bg-white text-black">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
        <h2 className="text-lg font-bold">Post Manager</h2>
        <PostFilters />
      </div>

      <ul className="flex flex-col">
        {allPosts ? (
          allPosts.map((post) => {
            return <PostItem key={post.id} post={post} />;
          })
        ) : (
          <li>Loading Posts...</li>
        )}
      </ul>
      <div className="flex items-center justify-center gap-6 py-4">
        {/* pagination nav */}
        {searchParams.page && parseInt(searchParams.page) > 1 ? (
          <Link
            className="w-[36px] text-center"
            href={`/admin/dashboard?view=posts${searchParams.search ? `&search=${searchParams.search}`:""}${searchParams.sent ? `&sent=${searchParams.sent}`:""}&page=${
              parseInt(searchParams.page) - 1
            }`}
          >
            Prev
          </Link>
        ) : 
          postsCount > 5 ? <span className="w-[36px] text-center opacity-0">Prev</span> : null
        }
        {postsCount > 5 ? searchParams.page ? (
          <span className="w-[90px] text-center">
            {(parseInt(searchParams.page)-1 )* 5 + 1}
            -
            {(parseInt(searchParams.page)) * 5 > postsCount
              ? postsCount
              : (parseInt(searchParams.page)) * 5}{" "}
            of {postsCount}
          </span>
        ) : (
          <span>
            {"1 - "}
            {postsCount < 5
              ? postsCount
              : 5}{" "}
            of {postsCount}
          </span>
        ): postsCount !== 0 ? <span>{postsCount} of {postsCount}</span> : <span>No results for "{searchParams.search}"</span>}

        {searchParams.page ? (
          5 * parseInt(searchParams.page) < postsCount ? (
            <Link
              className="w-[36px] text-center"
              href={`/admin/dashboard?view=posts${searchParams.search ? `&search=${searchParams.search}`:""}${searchParams.sent ? `&sent=${searchParams.sent}`:""}&page=${
                searchParams.page ? parseInt(searchParams.page) + 1 : 2
              }`}
            >
              Next
            </Link>
          ) : (
            <span className="w-[36px] text-center opacity-0">Next</span>
          )
        ) : postsCount > 5 ? (
          <Link
            href={`/admin/dashboard?view=posts${searchParams.search ? `&search=${searchParams.search}`:""}${searchParams.sent ? `&sent=${searchParams.sent}`:""}&page=${
              searchParams.page ? parseInt(searchParams.page) + 1 : 2
            }`}
          >
            Next
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
