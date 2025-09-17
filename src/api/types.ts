// API Response Types
export interface Order {
  id: number;
  status: string;
  total: string;
  date_created: string;
}

export interface Attendee {
  id: number;
  name: string;
  email: string;
  license_state: string;
  certification?: string;
  courses?: string[];
  instruments?: string[];
}

export interface DangerZoneEvent {
  event_id: number;
  title: string;
  status: string;
  combined: number;
  threshold: number;
  daysUntil: number;
}

export interface CEUCompliance {
  id: number;
  name: string;
  license_state: string;
  ceuStatus: string;
}

