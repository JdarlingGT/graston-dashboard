import { useQuery } from "@tanstack/react-query";
import { API } from "../api/apiClient";

export default function Certification() {
  const { data, isLoading } = useQuery({
    queryKey: ["attendees"],
    queryFn: () => API.getAttendees(),
  });

  if (isLoading) return <p>Loading certifications...</p>;

  const eligible = data?.filter(
    (a: any) =>
      (a.certification === "Eligible") ||
      (a.courses?.includes("Essential") &&
        a.courses?.includes("Advanced") &&
        a.instruments?.length > 0)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Certification Pipeline</h2>
      <p className="mb-4">{eligible?.length} attendees are certification eligible</p>
      <ul>
        {eligible?.map((a: any) => (
          <li key={a.id}>
            {a.name} → {a.certification || "Eligible"}
          </li>
        ))}
      </ul>
    </div>
  );
}
