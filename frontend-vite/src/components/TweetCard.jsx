import { useState, useContext, useEffect } from "react";
import ReplyBox from "../ReplyBox";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const TweetCard = ({ tweet, onDelete }) => {
  const { user } = useContext(AuthContext) || {};
  const currentUser = user || JSON.parse(localStorage.getItem("user"));
  const authorId = tweet.author?._id;
  const currentUserId = currentUser?._id || currentUser?.id;

  const isAuthor = currentUserId && authorId && currentUserId === authorId;
  const isOwnTweet = authorId === currentUserId;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [likesCount, setLikesCount] = useState(tweet.likes?.length || 0);
  const [liked, setLiked] = useState(tweet.likes?.some(id => id === currentUserId) || false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    if (tweet.author && currentUser && Array.isArray(tweet.author.followers)) {
      setIsFollowing(tweet.author.followers.includes(currentUserId));
    }
  }, [tweet, currentUser, currentUserId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
    setLoadingDelete(true);
    try {
      await axios.delete(`/api/tweets/${tweet._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (onDelete) onDelete(tweet._id);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  const submitEdit = async () => {
    if (!editContent.trim()) return; // prevent empty content
    setLoadingEdit(true);
    try {
      const res = await axios.put(
        `/api/tweets/${tweet._id}`,
        { content: editContent.trim() },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsEditing(false);
      setEditContent(res.data.content);
    } catch (err) {
      console.error("Edit failed", err);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleLike = async () => {
    setLoadingLike(true);
    try {
      await axios.post(
        `/api/tweets/${tweet._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!liked) {
        setLiked(true);
        setLikesCount((count) => count + 1);
      }
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleDislike = async () => {
    setLoadingLike(true);
    try {
      await axios.post(
        `/api/tweets/${tweet._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (liked) {
        setLiked(false);
        setLikesCount((count) => (count > 0 ? count - 1 : 0));
      }
    } catch (err) {
      console.error("Dislike failed", err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleFollow = async () => {
    if (loadingFollow) return;
    setLoadingFollow(true);
    try {
      const action = isFollowing ? "unfollow" : "follow";
      const url = `/api/users/${tweet.author.username}/${action}`;
      await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  const formattedDate = tweet.createdAt
    ? new Date(tweet.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
    <div className="border border-gray-700 p-4 rounded-xl mb-4 bg-gray-900 shadow-md text-white hover:bg-gray-800 transition-colors duration-300">
  <div className="flex items-start gap-3 mb-3">
    <img
      src={tweet.author?.avatar || "/default-avatar.png"}
      alt={`${tweet.author?.username || "user"}'s avatar`}
      className="w-12 h-12 rounded-full border-2 border-blue-500"
    />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-white truncate">
        <Link to={`/profile/${tweet.author?.username}`} className="hover:underline hover:text-blue-400 transition-colors duration-200">
          @{tweet.author?.username || "unknown"}
        </Link>
      </p>
      <p className="text-xs text-gray-400">{formattedDate}</p>
    </div>
    {!isAuthor && tweet.author?.username && (
      <button
        onClick={handleFollow}
        disabled={loadingFollow}
        className={`ml-auto px-4 py-1 rounded-full text-xs font-semibold transition-colors duration-200
          ${isFollowing
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
        aria-pressed={isFollowing}
      >
        {loadingFollow ? "Processing..." : isFollowing ? "Following" : "Follow"}
      </button>
    )}
  </div>

  {isEditing ? (
    <div className="mt-2">
      <textarea
        className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        disabled={loadingEdit}
      />
      <div className="mt-2 flex gap-3">
        <button
          onClick={submitEdit}
          disabled={loadingEdit || !editContent.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors duration-200"
        >
          {loadingEdit ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => {
            setIsEditing(false);
            setEditContent(tweet.content);
          }}
          disabled={loadingEdit}
          className="px-4 py-2 text-gray-400 rounded-full text-sm hover:text-gray-200 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <p className="mt-1 whitespace-pre-wrap text-white">{editContent}</p>
  )}

  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-400">
    <button
      onClick={handleLike}
      disabled={loadingLike || liked || isOwnTweet}
      aria-pressed={liked}
      className={`flex items-center gap-1 font-semibold transition-colors duration-200 hover:text-blue-400 ${
        liked ? "text-blue-400 bg-blue-900/30" : "text-gray-400"
      } ${isOwnTweet ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      👍 Like {likesCount}
    </button>
    <button
      onClick={handleDislike}
      disabled={loadingLike || !liked || isOwnTweet}
      aria-pressed={!liked}
      className={`flex items-center gap-1 font-semibold transition-colors duration-200 hover:text-red-400 ${
        !liked ? "text-gray-400" : "text-red-400 bg-red-900/30"
      } ${isOwnTweet ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      👎 Dislike
    </button>

    {isAuthor && (
      <>
        <button
          onClick={() => setIsEditing(true)}
          className="hover:text-yellow-400 transition-colors duration-200"
          aria-label="Edit Tweet"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          className="hover:text-red-500 transition-colors duration-200"
          aria-label="Delete Tweet"
        >
          {loadingDelete ? "Deleting..." : "🗑️ Delete"}
        </button>
      </>
    )}
  </div>
</div>


  );
};

export default TweetCard;
