import { useEffect, useState } from "react";
import axios from "axios";
import TweetCard from "../components/TweetCard";

const Timeline = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/tweets/timeline", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTweets(res.data.tweets || []);
      } catch (err) {
        console.error("Error fetching timeline:", err);
        setError("Failed to load timeline. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-6 p-6 bg-black text-orange rounded border border-orange text-center">
        <p>Loading timeline...</p>
      </div>
    );
  }

  return (
  <div className="max-w-2xl mx-auto mt-6 bg-[#15202b] text-white rounded-xl border border-gray-700 p-6 shadow-md">
  <h1 className="text-2xl font-extrabold mb-5 text-white border-b border-gray-700 pb-3">
    Home
  </h1>

  {error && (
    <p className="mb-4 text-red-500 font-semibold text-center">{error}</p>
  )}

  {tweets.length === 0 ? (
    <p className="text-gray-400 text-center">No tweets to show.</p>
  ) : (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </div>
  )}
</div>

  );
};

export default Timeline;
