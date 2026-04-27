export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

export interface Event {
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

export interface EventSectionProps {
  title: string;
  badgeClass: string;
  cardClass: string;
  items: Event[];
  emptyLabel: string;
}
