import React, { useEffect, useState } from "react";
import axios from "axios";
import Tweet from "../components/Tweet";

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/tweets");
        setTweets(res.data);
      } catch (err) {
        setError("Failed to load tweets. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
   <div className="max-w-2xl mx-auto px-4 py-6">
  <h1 className="text-2xl font-extrabold text-white mb-6 border-b border-gray-700 pb-2">
    Latest Tweets
  </h1>

  {loading && (
    <p className="text-gray-400 text-center mb-4">Loading tweets...</p>
  )}

  {error && (
    <p className="text-red-500 bg-red-900 bg-opacity-20 p-2 rounded mb-4 text-center" role="alert">
      {error}
    </p>
  )}

  {!loading && !error && tweets.length === 0 && (
    <p className="text-gray-400 text-center">No tweets found.</p>
  )}

  <div className="space-y-4">
    {!loading && !error && tweets.map((tweet) => (
      <div
        key={tweet._id}
        className="bg-[#15202b] border border-gray-700 rounded-lg p-4 shadow-sm hover:bg-[#1e2a38] transition"
      >
        <Tweet tweet={tweet} />
      </div>
    ))}
  </div>
</div>
  );
}
