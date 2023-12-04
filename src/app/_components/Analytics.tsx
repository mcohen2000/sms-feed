import { api } from "~/trpc/server";
import MonthlySubscriberChart from "./MonthlySubscriberChart";

export default async function Analytics() {
  const subCount = await api.user.subscriberCount.query();

  return (
    <>
      <div className="flex w-full flex-wrap gap-2">
        <div className="flex flex-grow flex-col items-center justify-center rounded-md bg-white p-4 text-black">
          <p className="text-center text-lg font-bold">Total Subscribers:</p>
          <p className="text-lg">{subCount}</p>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center rounded-md bg-white p-4 text-black">
          <p className="text-center text-lg font-bold">Total Subscribers:</p>
          <p className="text-lg">{subCount}</p>
        </div>
      </div>
      <MonthlySubscriberChart />
    </>
  );
}
