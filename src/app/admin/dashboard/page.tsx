import { CreatePost } from "~/app/_components/CreatePostForm";
import SMSDashboard from "~/app/_components/SMSDashboard";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

import Analytics from "~/app/_components/Analytics";
import DashboardNav from "~/app/_components/DashboardNav";
type Props = {
  params: {};
  searchParams: { [key: string]: string | undefined };
};
export default async function DashboardPage(props: Props) {
  const session = await getServerAuthSession();
  if (session?.user.role !== "admin") {
    return redirect("/admin/login");
  }
  const view = props.searchParams.view || 'posts';
  return (
    <div className="flex h-full min-h-screen flex-col items-center py-8 justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="py-4">Welcome back, {session?.user.firstName}</p>
      <div className="flex w-[80%] flex-col items-center justify-center gap-2">
      <DashboardNav view={props.searchParams.view}/>
        { view === 'posts' && <><CreatePost />
        <SMSDashboard search={props.searchParams.search} sent={props.searchParams.sent} page={props.searchParams.page}/>
        </>}
        { view === 'analytics' && <Analytics/>}
        
        
        
      </div>
    </div>
  );
}
