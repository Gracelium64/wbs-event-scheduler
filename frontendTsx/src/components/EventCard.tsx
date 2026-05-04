import { useNavigate } from "react-router-dom";
import type { Events } from "../schemas";

const EventCard = (event: Events) => {
  const navigate = useNavigate();

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      className="card bg-gray-900 border border-gray-700 shadow-lg hover:shadow-xl hover:border-gray-500 hover:scale-102 transition-all duration-200 cursor-pointer"
    >
      <div className="card-body p-4">
        <h2 className="card-title text-lg text-white">{event.title}</h2>

        <div className="flex items-center gap-4 text-gray-300 text-sm mb-3">
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span>{event.location || "Location TBD"}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">🕒</span>
            <span>{formatDateTime(event.date)}</span>
          </div>
        </div>

        <p className="text-gray-400 text-xs truncate">
          {event.description || "No description"}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
