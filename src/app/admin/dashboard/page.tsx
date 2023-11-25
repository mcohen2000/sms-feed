import { CreatePost } from "~/app/_components/create-post";
import SMSDashboard from "~/app/_components/SMSDashboard";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export default async function DashboardPage() {
    const session = await getServerAuthSession();
    if(session?.user.role !== "admin"){
        return redirect('/admin/login')
    }
  return (
    <div className='h-screen flex flex-col justify-start items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white'>
        <h1>Dashboard</h1>
        <p>Welcome back, {session?.user.firstName}</p>
        <SMSDashboard/>
    </div>
  )
}
