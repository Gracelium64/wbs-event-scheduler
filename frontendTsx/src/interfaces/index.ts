export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

export interface Events {
  id: number | string;
  title: string;
  description?: string;
  date: string;
  location: string;
  latitude?: number;
  longitude?: number;
  organizerId: number | string;
  organizerEmail: string;
}

export type CreateEventPayload = Omit<Events, "id" | "organizerEmail">;
export type UpdateEventPayload = CreateEventPayload & { id: number | string };

export interface EventSectionProps {
  title: string;
  badgeClass: string;
  cardClass: string;
  items: Events[];
  emptyLabel: string;
}

export interface User {
  id?: number | string;
  name?: string;
  email?: string;
  password?: string;
}
