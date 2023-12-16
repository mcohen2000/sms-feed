import { CreatePost } from "~/app/_components/CreatePostForm";
import SMSDashboard from "~/app/_components/SMSDashboard";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Analytics from "~/app/_components/Analytics";
import DashboardNav from "~/app/_components/DashboardNav";
import WelcomeMessage from "~/app/_components/WelcomeMessage";
import { api } from "~/trpc/server";
type Props = {
  params: {};
  searchParams: { [key: string]: string | undefined };
};
export default async function DashboardPage(props: Props) {
  const session = await getServerAuthSession();
  if (session?.user.role !== "admin") {
    return redirect("/admin/login");
  }
  const view = props.searchParams.view || "posts";
  const welcomeMsgPost = await api.post.getWelcomeMsg.query();
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] py-8 text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-col gap-2 p-4">
        <p className="">Welcome back, {session?.user.firstName}</p>
        <Link
          href={"/api/auth/signout"}
          className="rounded-full text-center bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign out
        </Link>
      </div>
      <div className="flex w-[80%] flex-col items-center justify-center gap-2">
        <DashboardNav view={props.searchParams.view} />
        {view === "posts" && (
          <>
            <WelcomeMessage post={welcomeMsgPost} />
            {welcomeMsgPost ? (
              <>
                <CreatePost />
                <SMSDashboard
                  search={props.searchParams.search}
                  sent={props.searchParams.sent}
                  page={props.searchParams.page}
                />
              </>
            ) : (
              <></>
            )}
          </>
        )}
        {view === "analytics" && <Analytics />}
      </div>
    </div>
  );
}
