import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../server/eventsFunctions';

export default function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  console.log('Current user', userId);
  console.log('Organizer Id', event?.organizerId);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen  text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading event...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen  text-white">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
          <p className="text-red-400">⚠️ Error: {error}</p>
        </div>
      </div>
    );

  if (!event)
    return (
      <div className="flex items-center justify-center min-h-screen  text-white">
        <p className="text-gray-400">Event not found</p>
      </div>
    );

  const currentUserId = Number(userId);
  const eventOrganizerId = Number(event.organizerId);
  const canEditEvent =
    Number.isFinite(currentUserId) &&
    Number.isFinite(eventOrganizerId) &&
    currentUserId === eventOrganizerId;

  const eventDate = new Date(event.date).toLocaleString('es-ES');

  return (
    <div className="min-h-screen text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex justify-between items-start">
            <h1 className="text-5xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              {event.title}
            </h1>
            <div className="relative group">
              <button
                disabled={!canEditEvent}
                onClick={() => {
                  navigate(`/events/${event.id}/edit`);
                  console.log('navigating');
                }}
                className={
                  'mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ' +
                  (canEditEvent
                    ? 'opacity-100 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed')
                }
              >
                Edit this event
              </button>
              {!canEditEvent && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-red-500/50 rounded-lg text-sm text-red-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  You are not the organizer of this event
                </div>
              )}
            </div>
          </div>
          <div className="h-1 w-24 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  📅 Date & Time
                </p>
                <p className="text-xl text-gray-100">{eventDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  📍 Location
                </p>
                <p className="text-xl text-gray-100">{event.location}</p>
              </div>
            </div>

            {/* Map Section */}
            {event.latitude && event.longitude && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">
                  Location Map
                </h3>
                <div className="rounded-lg overflow-hidden shadow-xl h-96 border border-gray-700/50">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.longitude - 0.01},${event.latitude - 0.01},${event.longitude + 0.01},${event.latitude + 0.01}&layer=mapnik&marker=${event.latitude},${event.longitude}`}
                  />
                </div>
                <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <p className="text-sm text-gray-400">
                    <span className="text-green-400 font-mono">
                      {event.latitude}
                    </span>
                    {' | '}
                    <span className="text-green-400 font-mono">
                      {event.longitude}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-gray-900/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl sticky top-4">
              <h3 className="text-lg font-semibold mb-6 text-cyan-400">
                Event Details
              </h3>

              <div className="space-y-4">
                <div className="border-t border-gray-700/50 pt-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Created
                  </p>
                  <p className="text-sm text-gray-300">
                    {new Date(event.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>

                <div className="border-t border-gray-700/50 pt-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-300">
                    {new Date(event.updatedAt).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
