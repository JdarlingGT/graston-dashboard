import { API } from "../api/apiClient";
import { useQuery } from "@tanstack/react-query";

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["danger-zone"],
    queryFn: () => API.getDangerZone(),
  });

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">Error loading data</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {data?.map((ev: any) => (
          <li key={ev.event_id}>
            {ev.title} → <strong>{ev.status}</strong> ({ev.combined}/{ev.threshold})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;