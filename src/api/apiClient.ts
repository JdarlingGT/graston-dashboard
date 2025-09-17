const API_BASE = import.meta.env.VITE_API_BASE || "https://grastonguideconnection.jdarling.workers.dev";

async function apiFetch<T>(path: string, options: RequestInit = {}, retry = 0): Promise<T> {
  try {
    const resp = await fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
    });

    if (resp.status === 401 && retry < 1) {
      await fetch(`${API_BASE}/auth/refresh`, { credentials: "include" });
      return apiFetch(path, options, retry + 1);
    }

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || `API request failed: ${resp.status}`);
    }

    return resp.json();
  } catch (e) {
    console.error("apiFetch error:", e, path);
    throw e;
  }
}

export const API = {
  getOrders: (params = "") => apiFetch<any[]>(`/woo/orders${params}`),
  getDangerZone: () => apiFetch<any[]>(`/events/danger-zone`),
  getAttendees: () => apiFetch<any[]>(`/learndash/users`),
  getCEUCompliance: (state: string) =>
    apiFetch<any[]>(`/insights?q=ceu compliance&state=${state}`),
};
