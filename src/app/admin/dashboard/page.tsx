import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getServerAuthSession();
    if(session?.user.role !== "admin"){
        redirect('/admin/login')
    }
  return (
    <div>
        <h1>Dashboard</h1>
        <p>Welcome back, {session?.user.firstName}</p>
    </div>
  )
}
