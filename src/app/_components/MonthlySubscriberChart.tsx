"use client";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";

type MonthlyStatistic = {
  monthyear: String;
  signupscount: Number;
};
export default function MonthlySubscriberChart(data: {monthlyData: MonthlyStatistic[]}) {
  return (
    <div className="h-[50vh] w-full rounded-md bg-white p-4">
      <p className="text-lg font-bold text-black">Monthly Sign Ups:</p>
      <ResponsiveContainer>
        <AreaChart
          data={data.monthlyData}
          margin={{ top: 20, right: 20, left: -20, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <XAxis dataKey="monthyear" dy={10} />
          <YAxis allowDecimals={false} dx={-10} />
          <CartesianGrid stroke="#ccc" />
          <Tooltip labelStyle={{ color: "black" }} />
          <Area
            type="monotone"
            dataKey="signupscount"
            name="Sign Ups"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
