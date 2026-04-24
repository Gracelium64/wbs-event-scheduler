import { useEffect, useState } from 'react';
import { EventCard } from '../components';

import { getAllEvents } from '../server/eventsFunctions';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data?.results || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      setEvents([]);
      setLoading(true);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center">Event list</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
};

export default Home;
