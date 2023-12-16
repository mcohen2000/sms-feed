import { api } from "~/trpc/server";
import MonthlySubscriberChart from "./MonthlySubscriberChart";

export default async function Analytics() {
  const subCount = await api.user.subscriberCount.query();
  const sentMsgCount = await api.post.countSent.query();
  type MonthlyStatistic = {
    monthyear: String;
    signupscount: Number;
  };
  const monthlyData = await api.user.subscriberMonthlyCount.query() as MonthlyStatistic[];

  return (
    <>
      <div className="flex w-full flex-wrap gap-2">
        <div className="flex flex-grow flex-col basis-3/12 items-center justify-center  rounded-md bg-white p-4 text-black">
          <p className="text-center text-lg font-bold">Total Subscribers:</p>
          <p className="text-lg">{subCount}</p>
        </div>
        <div className="flex flex-grow flex-col basis-3/12 items-center justify-center rounded-md bg-white p-4 text-black">
          <p className="text-center text-lg font-bold">Total Messages Sent:</p>
          <p className="text-lg">{sentMsgCount}</p>
        </div>
      </div>
      <MonthlySubscriberChart monthlyData={monthlyData}/>
    </>
  );
}
