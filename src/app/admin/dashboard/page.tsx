import { CreatePost } from "~/app/_components/CreatePostForm";
import SMSDashboard from "~/app/_components/SMSDashboard";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  if (session?.user.role !== "admin") {
    return redirect("/admin/login");
  }
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Dashboard</h1>
      <p>Welcome back, {session?.user.firstName}</p>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <CreatePost />
        <SMSDashboard />
      </div>
    </div>
  );
}
