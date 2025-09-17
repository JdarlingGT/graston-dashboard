import { useQuery } from "@tanstack/react-query";
import { API } from "../api/apiClient";

function Attendees() {
  const { data, isLoading } = useQuery({
    queryKey: ["attendees"],
    queryFn: () => API.getAttendees(),
  });

  if (isLoading) return <p>Loading attendees...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Attendees</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th>Email</th>
              <th>License State</th>
              <th>Certification</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((u: any) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{u.name}</td>
                <td>{u.email?.replace(/(.{2}).+(@.+)/, "$1***$2")}</td>
                <td>{u.license_state}</td>
                <td>{u.certification || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendees;
