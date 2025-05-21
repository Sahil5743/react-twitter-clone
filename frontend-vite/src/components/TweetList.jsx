import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TweetList = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likeLoadingId, setLikeLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchTweets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/tweets");
      setTweets(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tweets.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (tweetId) => {
    setLikeLoadingId(tweetId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/tweets/${tweetId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTweets((prevTweets) =>
        prevTweets.map((tweet) => {
          if (tweet._id !== tweetId) return tweet;
          const userId = JSON.parse(localStorage.getItem("user"))?._id;
          const liked = tweet.likes?.includes(userId);
          let newLikes;
          if (!liked) {
            newLikes = [...(tweet.likes || []), userId];
          } else {
            newLikes = tweet.likes;
          }
          return { ...tweet, likes: newLikes };
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoadingId(null);
    }
  };

  const handleDislike = async (tweetId) => {
    setLikeLoadingId(tweetId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/tweets/${tweetId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTweets((prevTweets) =>
        prevTweets.map((tweet) => {
          if (tweet._id !== tweetId) return tweet;
          const userId = JSON.parse(localStorage.getItem("user"))?._id;
          const liked = tweet.likes?.includes(userId);
          let newLikes;
          if (liked) {
            newLikes = tweet.likes.filter((id) => id !== userId);
          } else {
            newLikes = tweet.likes;
          }
          return { ...tweet, likes: newLikes };
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoadingId(null);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  if (loading) return <p className="text-orange p-4">Loading tweets...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

  return (
    <div>
      {tweets.length === 0 && <p className="text-orange p-4">No tweets found.</p>}
      {tweets.map((tweet) => {
        const liked = tweet.likes?.includes(currentUserId);
        const likesCount = tweet.likes?.length || 0;
        const createdAt = tweet.createdAt
          ? new Date(tweet.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "";
        const isOwnTweet = tweet.author?._id === currentUserId;

        return (
          <article
            key={tweet._id}
            className="p-4 bg-gray-900 border border-gray-700 rounded-xl mb-4 text-white shadow-sm hover:bg-gray-800 transition-colors duration-200"
            aria-label={`Tweet by @${tweet.author?.username || "unknown"}`}
          >
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {tweet.content}
            </p>

            <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
              <Link
                to={`/profile/${tweet.author?.username}`}
                className="font-semibold text-blue-400 hover:underline truncate max-w-xs"
                title={`@${tweet.author?.username || "unknown"}`}
              >
                @{tweet.author?.username || "unknown"}
              </Link>
              <time
                dateTime={tweet.createdAt}
                className="ml-2 text-xs whitespace-nowrap"
              >
                {createdAt}
              </time>
            </div>

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleLike(tweet._id)}
                disabled={likeLoadingId === tweet._id || liked || isOwnTweet}
                aria-pressed={liked}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full px-3 py-1
      ${liked ? "text-blue-400 bg-blue-900/30" : "text-gray-400 hover:text-blue-400"} ${isOwnTweet ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                👍 Like {likesCount}
              </button>
              <button
                onClick={() => handleDislike(tweet._id)}
                disabled={likeLoadingId === tweet._id || !liked || isOwnTweet}
                aria-pressed={!liked}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full px-3 py-1
      ${!liked ? "text-gray-400" : "text-red-400 bg-red-900/30 hover:text-red-500"} ${isOwnTweet ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                👎 Dislike
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default TweetList;
