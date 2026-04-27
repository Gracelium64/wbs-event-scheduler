import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getAllEvents } from "../server/eventsFunctions";
import { getUserById } from "../server/usersFunctions";
import { getLoggedUser } from "../server/authFunctions";
import type { EventSectionProps, Events } from "../interfaces";

const EVENTS_PAGE = 1;
const EVENTS_LIMIT = 100;

const Home = () => {
  const canEditEvent = (event: Events): boolean =>
    currentUserId !== null && currentUserId === event.organizerId;

  const navigate = useNavigate();
  const [events, setEvents] = useState<Events[]>([]);
  const [organizerById, setOrganizerById] = useState<
    Record<string, string | null>
  >({});
  const [isLoadingOrganizers, setIsLoadingOrganizers] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | number | null>(
    null,
  );
  console.log(currentUserId);
  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAllEvents(EVENTS_PAGE, EVENTS_LIMIT);
        const eventList = data?.results ?? [];
        setEvents(eventList);

        const organizerIds = [
          ...new Set(eventList.map((event: Events) => event.organizerId)),
        ].filter((id) => id !== null && id !== undefined);

        if (!organizerIds.length) {
          setOrganizerById({});
        } else {
          setIsLoadingOrganizers(true);
          const organizerEntries = await Promise.all(
            organizerIds.map(async (organizerId) => {
              try {
                const user = await getUserById(organizerId);

                const nameCandidates = [
                  user?.name,
                  user?.data?.name,
                  user?.User?.name,
                  user?.user?.name,
                  user?.profile?.name,
                  user?.email,
                  user?.data?.email,
                ];

                const resolved = nameCandidates.find(
                  (v) => v && String(v).trim(),
                );

                return [organizerId, resolved ? String(resolved).trim() : null];
              } catch {
                return [organizerId, null];
              }
            }),
          );

          setOrganizerById(Object.fromEntries(organizerEntries));
          setIsLoadingOrganizers(false);
        }
      } catch (loadError: unknown) {
        if (loadError instanceof Error) {
          setError(loadError.message || "Failed to load events");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const u = await getLoggedUser();
        setCurrentUserId(u?.id ?? null);
      } catch {
        setCurrentUserId(null);
      }
    }

    loadCurrentUser();
  }, []);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const sorted = [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const upcoming: Events[] = [];
    const past: Events[] = [];

    sorted.forEach((event) => {
      const eventDate = new Date(event.date);
      if (eventDate >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    return {
      upcomingEvents: upcoming,
      pastEvents: past.reverse(),
    };
  }, [events]);

  function formatDateTime(value: undefined | string): string {
    if (!value) return "No time set";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Invalid date";
    return parsed.toLocaleString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatNameFromEmail(email: string): string | null {
    if (!email) return null;
    const local = String(email).split("@")[0] || "";
    const parts = local.split(/[._\-+ ]+/).filter(Boolean);
    if (!parts.length) return email;
    return parts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
  }

  function getOrganizerName(
    organizerId: string | number,
    event: Events | null,
  ): string | null {
    const name = organizerById[organizerId];
    if (name) return name;
    if (isLoadingOrganizers && organizerId) return null; // signal loading
    if (event?.organizerEmail) return formatNameFromEmail(event.organizerEmail);
    return "Unknown organizer";
  }

  function EventSection({
    title,
    badgeClass,
    cardClass,
    items,
    emptyLabel,
  }: EventSectionProps) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{title}</h2>
          <span className={`badge badge-lg ${badgeClass}`}>{items.length}</span>
        </div>

        {!items.length ? (
          <div className="alert border border-base-300 bg-base-200/40">
            {emptyLabel}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {items.map((event) => (
              <article
                key={event.id}
                className={`card border border-base-300 shadow-md transition-all  hover:shadow-xl cursor-pointer ${cardClass}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/events/${event.id}/edit`);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="card-body gap-3">
                  <h3 className="card-title text-xl">{event.title}</h3>
                  <p className="text-sm text-base-content/80">
                    {event.description || "No description provided."}
                  </p>

                  <ul className="space-y-1 text-sm">
                    <li>
                      <span className="font-semibold">Time:</span>{" "}
                      {formatDateTime(event.date)}
                    </li>
                    <li>
                      <span className="font-semibold">Place:</span>{" "}
                      {event.location}
                    </li>
                    <li>
                      <span className="font-semibold">Event organizer:</span>{" "}
                      {getOrganizerName(event.organizerId, event)}
                    </li>
                  </ul>

                  <div className="card-actions justify-end">
                    {canEditEvent(event) && (
                      <span
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className="btn btn-sm btn-outline"
                      >
                        Edit Event
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <span
          className="loading loading-spinner loading-lg"
          aria-label="Loading events"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-base-300 bg-base-200/50 p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Event Dashboard</h1>
        <p className="text-base-content/75 mt-2">
          Browse upcoming and past events. Use the Edit button to modify events
          you organize.
        </p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {!error && (
        <>
          {EventSection({
            title: "Coming Up",
            badgeClass: "badge-primary",
            cardClass: "bg-base-100",
            items: upcomingEvents,
            emptyLabel: "No upcoming events yet.",
          })}

          {EventSection({
            title: "Past Events",
            badgeClass: "badge-neutral",
            cardClass: "bg-base-200/50",
            items: pastEvents,
            emptyLabel: "No past events yet.",
          })}
        </>
      )}
    </div>
  );
};

export default Home;
