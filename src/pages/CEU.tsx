import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../api/apiClient";

export default function CEU() {
  const [state, setState] = useState("TX");
  const { data, isLoading } = useQuery({
    queryKey: ["ceu", state],
    queryFn: () => API.getCEUCompliance(state),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">CEU Compliance</h2>
      <label className="block mb-2">
        Select State:
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="ml-2 border p-1 rounded"
        >
          <option value="TX">TX</option>
          <option value="CA">CA</option>
          <option value="NY">NY</option>
        </select>
      </label>
      {isLoading ? (
        <p>Loading compliance...</p>
      ) : (
        <ul>
          {data?.map((u: any) => (
            <li key={u.id}>
              {u.name} ({u.license_state}) → {u.ceuStatus}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
