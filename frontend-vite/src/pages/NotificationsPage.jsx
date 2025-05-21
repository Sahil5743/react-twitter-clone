import { useEffect, useState } from "react";
import axios from "axios";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(res.data);
      } catch (err) {
        setError("Failed to load notifications. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
   <main className="max-w-2xl mx-auto px-4 py-6">
  <h2 className="text-2xl font-extrabold text-white mb-6 border-b border-gray-700 pb-2 flex items-center gap-2">
    <span role="img" aria-label="Notifications">🔔</span>
    Notifications
  </h2>

  {loading && (
    <p className="text-gray-400 text-center mb-4">Loading notifications...</p>
  )}

  {error && (
    <p className="bg-red-800 bg-opacity-20 text-red-400 border border-red-600 p-3 rounded text-center mb-4" role="alert" aria-live="assertive">
      {error}
    </p>
  )}

  {!loading && !error && notifications.length === 0 && (
    <p className="text-gray-400 text-center">No new notifications.</p>
  )}

  {!loading && !error && notifications.length > 0 && (
    <ul className="space-y-4">
      {notifications.map((n) => (
        <li
          key={n._id}
          className="flex items-start space-x-3 p-4 bg-[#15202b] rounded-xl border border-gray-700 hover:bg-[#1c2938] transition"
        >
          <img
            src={n.sender?.avatar || "https://via.placeholder.com/40"}
            alt={`${n.sender?.username}'s avatar`}
            className="w-11 h-11 rounded-full object-cover border border-gray-600"
          />
          <div className="flex flex-col text-white">
            <span className="font-semibold text-base">
              @{n.sender?.username || "unknown"}{" "}
              <span className="font-normal text-sm text-gray-400">
                {n.type === "reply" ? "replied to your tweet" : "liked your tweet"}
              </span>
            </span>
            <blockquote className="mt-2 text-gray-300 text-sm italic max-w-md">
              “{n.tweet?.content || "Tweet content unavailable"}”
            </blockquote>
            <time
              className="text-xs text-gray-500 mt-1"
              dateTime={n.createdAt}
              title={new Date(n.createdAt).toLocaleString()}
            >
              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{" "}
              {new Date(n.createdAt).toLocaleDateString()}
            </time>
          </div>
        </li>
      ))}
    </ul>
  )}
</main>

  );
};

export default NotificationsPage;
