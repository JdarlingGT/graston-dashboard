import { API } from "../api/apiClient";
import { useQuery } from "@tanstack/react-query";

function Events() {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["danger-zone"],
    queryFn: () => API.getDangerZone(),
    refetchInterval: 60000, // auto refresh every 60s
  });

  if (isLoading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">Error loading events</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Event Danger Zone</h2>
      <div className="space-y-3">
        {events?.sort((a: any, b: any) => a.daysUntil - b.daysUntil).map((ev: any) => (
          <div
            key={ev.event_id}
            className={`p-4 rounded shadow ${
              ev.status === "Danger"
                ? "bg-red-100 border border-red-500"
                : ev.status === "Watch"
                ? "bg-yellow-100 border border-yellow-500"
                : "bg-green-100 border border-green-500"
            }`}
          >
            <div className="flex justify-between">
              <span className="font-semibold">{ev.title}</span>
              <span className="italic">{ev.daysUntil} days away</span>
            </div>
            <p>
              {ev.combined}/{ev.threshold} confirmed →{" "}
              <strong>{ev.status}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;