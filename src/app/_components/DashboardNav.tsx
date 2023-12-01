import Link from "next/link";

export default function DashboardNav(searchParams: {
  [key: string]: string | undefined;
}) {
  console.log(searchParams);
  let view = searchParams.view || "posts";
  return (
    <div className="flex w-full items-center justify-evenly bg-white p-4 text-gray-500 rounded-md">
      <Link
        href={"/admin/dashboard?view=posts"}
        className={`w-[100px] flex flex-col items-center justify-between rounded-md px-3 py-2 ${
          view === "posts" ? "text-sky-500" : "text-gray-500"
        } hover:bg-gray-500/20`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>

        <span>Posts</span>
      </Link>
      <Link
        href={"/admin/dashboard?view=analytics"}
        className={`w-[100px] flex flex-col items-center justify-between rounded-md px-3 py-2 ${
            view === "analytics" ? "text-sky-500" : "text-gray-500"
          } hover:bg-gray-500/20`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
          />
        </svg>

        <span>Analytics</span>
      </Link>
    </div>
  );
}
