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
  organizerId: number | string | null;
  organizerEmail: string;
}

export interface EventSectionProps {
  title: string;
  badgeClass: string;
  cardClass: string;
  items: Events[];
  emptyLabel: string;
}
