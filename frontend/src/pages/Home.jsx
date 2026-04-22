import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllEvents } from "../server/eventsFunctions";

const PAGE_LIMIT = 50;

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAllEvents() {
      try {
        setIsLoading(true);
        setError("");

        let page = 1;
        let hasNextPage = true;
        let allEvents = [];

        while (hasNextPage) {
          const response = await getAllEvents({ page, limit: PAGE_LIMIT });
          const pageResults = Array.isArray(response.results)
            ? response.results
            : [];

          allEvents = [...allEvents, ...pageResults];
          hasNextPage = Boolean(response.hasNextPage);
          page += 1;
        }

        if (!cancelled) {
          setEvents(allEvents);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Failed to fetch events");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAllEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Events</h1>
        <span className="badge badge-outline">{events.length} total</span>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm">
          <span className="loading loading-spinner loading-sm" />
          Loading events...
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!isLoading && !error && events.length === 0 && (
        <div className="alert">
          <span>No events found.</span>
        </div>
      )}

      {!isLoading && !error && events.length > 0 && (
        <div className="grid gap-4">
          {events.map((eventItem) => (
            <article
              key={eventItem.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/events/${eventItem.id}/edit`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/events/${eventItem.id}/edit`);
                }
              }}
              className="card bg-base-100 border border-base-300 shadow-sm cursor-pointer transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="card-body">
                <h2 className="card-title">{eventItem.title}</h2>
                <p className="text-sm opacity-70">{eventItem.description}</p>
                <div className="text-sm mt-2 space-y-1">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(eventItem.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Location:</strong> {eventItem.location}
                  </p>
                  <p>
                    <strong>Organizer:</strong> {eventItem.organizerId}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;
