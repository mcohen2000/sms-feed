import { api } from "~/trpc/server";
import PostFilters from "./PostFilters";
import Link from "next/link";
import PostQueueItem from "./PostQueueItem";

export default async function PostQueue(searchParams: {
  [key: string]: string | undefined;
}) {
  const allPosts = await api.post.getAll.query({
    search: searchParams.search || "",
    sent: searchParams.sent || "true",
    page: searchParams.page || "",
    sortBy: "sendDate"
  });
  const postsCount = await api.post.count.query({
    search: searchParams.search || "",
    sent: searchParams.sent || "true",
  });
  return (
    <div className="w-full rounded-md bg-white text-black">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
        <h2 className="text-lg font-bold">Post Queue</h2>
        <PostFilters />
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead className="table-header-group border-b-2">
            <tr className="table-row">
              {/* <div className="flex items-center gap-4"> */}
              <th className="w-[100px] min-w-[100px] max-w-[100px] px-4 py-3">
                Date
              </th>
              <th className="w-[400px] min-w-[400px] max-w-[400px] truncate px-4 py-3">
                Body
              </th>
              <th className="w-[100px] min-w-[100px] px-4 py-3">Status</th>
              <th className="w-[100px] min-w-[100px] px-4 py-3"># Delivered</th>
              {/* </div> */}
            </tr>
          </thead>
          <tbody className="table-row-group">
            {allPosts ? (
              allPosts.map((post) => (
                <PostQueueItem key={post.id} post={post} />
              ))
            ) : (
              <li>Loading Posts...</li>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center gap-6 py-4">
        {/* pagination nav */}
        {searchParams.page && parseInt(searchParams.page) > 1 ? (
          <Link
            className="w-[36px] text-center"
            href={`/admin/dashboard?view=queue${
              searchParams.search ? `&search=${searchParams.search}` : ""
            }${searchParams.sent ? `&sent=${searchParams.sent}` : ""}&page=${
              parseInt(searchParams.page) - 1
            }`}
          >
            Prev
          </Link>
        ) : postsCount > 5 ? (
          <span className="w-[36px] text-center opacity-0">Prev</span>
        ) : null}
        {postsCount > 5 ? (
          searchParams.page ? (
            <span className="w-[90px] text-center">
              {(parseInt(searchParams.page) - 1) * 5 + 1}-
              {parseInt(searchParams.page) * 5 > postsCount
                ? postsCount
                : parseInt(searchParams.page) * 5}{" "}
              of {postsCount}
            </span>
          ) : (
            <span>
              {"1 - "}
              {postsCount < 5 ? postsCount : 5} of {postsCount}
            </span>
          )
        ) : postsCount !== 0 ? (
          <span>
            {postsCount} of {postsCount}
          </span>
        ) : (
          <span>No results for "{searchParams.search}"</span>
        )}

        {searchParams.page ? (
          5 * parseInt(searchParams.page) < postsCount ? (
            <Link
              className="w-[36px] text-center"
              href={`/admin/dashboard?view=queue${
                searchParams.search ? `&search=${searchParams.search}` : ""
              }${searchParams.sent ? `&sent=${searchParams.sent}` : ""}&page=${
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
            href={`/admin/dashboard?view=queue${
              searchParams.search ? `&search=${searchParams.search}` : ""
            }${searchParams.sent ? `&sent=${searchParams.sent}` : ""}&page=${
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
