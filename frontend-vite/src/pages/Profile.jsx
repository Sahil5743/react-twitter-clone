// Profile.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import ReplyBox from "../ReplyBox";

const Profile = () => {
  const { username } = useParams();
  const { user, setUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editingTweetContent, setEditingTweetContent] = useState("");
  const [replyingToTweetId, setReplyingToTweetId] = useState(null);
  const [replies, setReplies] = useState({});
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const isOwnProfile = user && user.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `/api/users/${isOwnProfile ? user.username : username}`
        );
        if (!res.data || !res.data.user) {
          setError("User not found.");
          setProfileData(null);
        } else {
          setProfileData(res.data);
          setBio(res.data.user.bio || "");
        }
      } catch {
        setError("Failed to load profile.");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username, user, isOwnProfile]);

  useEffect(() => {
    if (user && profileData && profileData.user) {
      const currentUserId = user.id || user._id;
      setIsFollowing(
        (profileData.user.followers || []).some(
          (f) =>
            (typeof f === "object" ? f._id : f) === currentUserId
        )
      );
    }
  }, [profileData, user]);

  const normalizeUsers = (arr) =>
    (arr || []).map((f) =>
      typeof f === "object" && f.username
        ? f
        : typeof f === "object" && f._id
        ? { _id: f._id, username: f.username || "" }
        : { _id: f, username: "" }
    );

  const displayUser = (userObj) => {
    if (userObj.username && userObj.username !== "") {
      return `@${userObj.username}`;
    }
    if (userObj._id) {
      return `@user_${userObj._id.toString().slice(0, 8)}`;
    }
    return "@unknown";
  };

  const handleFollowToggle = async () => {
    try {
      const action = isFollowing ? "unfollow" : "follow";
      await axios.post(
        `/api/users/${username}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsFollowing(!isFollowing);
      setProfileData((prev) => {
        if (!prev || !prev.user) return prev;
        let followers = Array.isArray(prev.user.followers) ? [...prev.user.followers] : [];
        const currentUserId = user.id || user._id;
        if (isFollowing) {
          followers = followers.filter(
            (f) => (typeof f === "object" ? f._id : f) !== currentUserId
          );
        } else {
          followers.push({ _id: currentUserId, username: user.username });
        }
        return {
          ...prev,
          user: { ...prev.user, followers },
        };
      });
    } catch {
      alert("Failed to update follow status.");
    }
  };

  const handleSaveBio = async () => {
    try {
      const res = await axios.put(
        "/api/users/profile",
        { bio },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProfileData((prev) => ({
        ...prev,
        user: { ...prev.user, bio: res.data.user.bio },
      }));
      setUser(res.data.user);
      setEditMode(false);
      alert("Profile updated!");
    } catch {
      alert("Failed to update profile.");
    }
  };

  const followers = normalizeUsers(profileData?.user?.followers);
  const following = normalizeUsers(profileData?.user?.following);
  const currentUserId = user && (user._id || user.id);

  if (loading) return <p className="text-center mt-4 text-blue-300">Loading profile...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!profileData || !profileData.user) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-[#15202b] text-white rounded-xl border border-gray-700 shadow-xl">
      <header className="mb-6 flex items-start gap-4">
        <img
          src={profileData.user.avatar || "https://via.placeholder.com/64"}
          alt={`${profileData.user.username}'s avatar`}
          className="w-16 h-16 rounded-full border border-gray-600 object-cover"
        />
        <div>
          <h2 className="text-2xl font-extrabold">@{profileData.user.username}</h2>
          <div className="text-sm text-gray-400 flex gap-4 mt-1">
            <button onClick={() => setShowFollowers(true)} className="hover:underline">
              {followers.length} follower{followers.length !== 1 ? "s" : ""}
            </button>
            <button onClick={() => setShowFollowing(true)} className="hover:underline">
              {following.length} following
            </button>
          </div>
        </div>
      </header>

      {/* Bio Section */}
      <section className="mb-6">
        {isOwnProfile && editMode ? (
          <div>
            <textarea
              className="w-full p-3 border border-gray-600 rounded bg-[#192734] text-white resize-none"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className="mt-3 flex gap-3">
              <button className="bg-white text-black px-4 py-2 rounded-full" onClick={handleSaveBio}>
                Save
              </button>
              <button
                className="px-4 py-2 border border-gray-500 text-white rounded-full"
                onClick={() => {
                  setEditMode(false);
                  setBio(profileData.user.bio || "");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="whitespace-pre-wrap text-gray-200">{profileData.user.bio || "This user has no bio yet."}</p>
            {isOwnProfile && (
              <button
                className="mt-2 text-sm text-blue-400 hover:underline"
                onClick={() => setEditMode(true)}
              >
                Edit Bio
              </button>
            )}
          </div>
        )}
      </section>

      {/* Follow Button */}
      {!isOwnProfile && (
        <button
          onClick={handleFollowToggle}
          className={`px-5 py-2 rounded-full font-semibold mb-6 transition ${
            isFollowing
              ? "bg-white text-black hover:bg-gray-200"
              : "border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      {/* Tweets */}
      <section>
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Tweets</h3>
        {profileData.tweets.length === 0 ? (
          <p className="text-gray-400">No tweets yet.</p>
        ) : (
          profileData.tweets.map((tweet) => {
            const isOwnTweet = tweet.author?._id === currentUserId;
            return (
              <article
                key={tweet._id}
                className="bg-[#192734] rounded-xl p-4 mb-4 border border-gray-700 hover:bg-[#22303c] transition"
              >
                <p className="mb-2 text-white">{tweet.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{new Date(tweet.createdAt).toLocaleString()}</span>
                  <span>@{tweet.author?.username || "unknown"}</span>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
};

export default Profile;
