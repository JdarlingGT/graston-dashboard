import { useQuery } from "@tanstack/react-query";
import { API } from "../apiClient";
import { Order, DangerZoneEvent, Attendee, CEUCompliance } from "../types";

export const useOrders = (params = "") => {
  return useQuery<Order[]>({
    queryKey: ["orders", params],
    queryFn: () => API.getOrders(params),
  });
};

export const useDangerZone = () => {
  return useQuery<DangerZoneEvent[]>({
    queryKey: ["danger-zone"],
    queryFn: () => API.getDangerZone(),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useAttendees = () => {
  return useQuery<Attendee[]>({
    queryKey: ["attendees"],
    queryFn: () => API.getAttendees(),
  });
};

export const useCEUCompliance = (state: string) => {
  return useQuery<CEUCompliance[]>({
    queryKey: ["ceu-compliance", state],
    queryFn: () => API.getCEUCompliance(state),
    enabled: !!state,
  });
};
