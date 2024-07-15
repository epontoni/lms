import { getAnalytics } from "@/lib/actions/analytics.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";

export default async function AnalyticsPage() {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total sales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
}
