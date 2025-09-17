import { useQuery } from "@tanstack/react-query";
import { API } from "../api/apiClient";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics-global"],
    queryFn: () => API.getOrders("?per_page=50"),
  });

  const chartData =
    data?.map((o: any) => ({
      date: new Date(o.date_created).toLocaleDateString(),
      revenue: parseFloat(o.total),
    })) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Revenue Analytics</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#2563eb" />
        </LineChart>
      )}
    </div>
  );
}
