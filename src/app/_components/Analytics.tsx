import { api } from "~/trpc/server"

export default async function Analytics() {
    const subCount = await api.user.subscriberCount.query();
  return (
    <div>total subs: {subCount}</div>
  )
}
