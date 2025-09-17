import { API } from "../api/apiClient";
import { useQuery } from "@tanstack/react-query";

function Orders() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => API.getOrders("?per_page=20"),
  });

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">Error loading orders</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o: any) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{o.id}</td>
                <td>{o.status}</td>
                <td>${o.total}</td>
                <td>{new Date(o.date_created).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;