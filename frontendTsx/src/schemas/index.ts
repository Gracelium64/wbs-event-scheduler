import { z } from "zod/v4";

export const AuthContextTypeSchema = z.object({
  isLoggedIn: z.boolean(),
});

export type AuthContextType = z.infer<typeof AuthContextTypeSchema> & {
  setIsLoggedIn: (value: boolean) => void;
};

export const EventsSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  location: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  organizerId: z.union([z.number(), z.string()]),
  organizerEmail: z.string(),
});

export type Events = z.infer<typeof EventsSchema>;
export type CreateEventPayload = Omit<Events, "id" | "organizerEmail">;
export type UpdateEventPayload = CreateEventPayload & { id: number | string };

export const EventSectionPropsSchema = z.object({
  title: z.string(),
  badgeClass: z.string(),
  cardClass: z.string(),
  items: z.array(EventsSchema),
  emptyLabel: z.string(),
});

export type EventSectionProps = z.infer<typeof EventSectionPropsSchema>;

export const UserSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginResponseSchema = z.object({
  user: z.object({
    id: z.union([z.number(), z.string()]),
    email: z.string(),
  }),
  token: z.string(),
});

export type LoginResponseType = z.infer<typeof LoginResponseSchema>;

export const PaginatedEventsSchema = z.object({
  totalCount: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  results: z.array(EventsSchema),
});
export type PaginatedEvents = z.infer<typeof PaginatedEventsSchema>;