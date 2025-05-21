import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TweetCard from "../components/TweetCard";

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${username}`);
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading)
    return <p className="text-center mt-8 text-blue-300">Loading profile...</p>;

  if (error)
    return <p className="text-center mt-8 text-red-500">{error}</p>;

  if (!profile)
    return <p className="text-center mt-8 text-blue-300">No profile data available.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#15202b] text-white rounded-xl border border-gray-700 shadow-xl">
  <header className="flex items-center gap-4 border-b border-gray-700 pb-4 mb-6">
    <img
      src={profile.user.avatar || "https://via.placeholder.com/64"}
      alt={`${profile.user.username}'s avatar`}
      className="w-16 h-16 rounded-full object-cover border border-gray-600"
    />
    <div>
      <h2 className="text-2xl font-extrabold">@{profile.user.username}</h2>
      <p className="text-sm text-gray-400 break-all">{profile.user.email}</p>
    </div>
  </header>

  <section>
    <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Tweets</h3>
    {profile.tweets.length === 0 ? (
      <p className="text-gray-500">No tweets to display.</p>
    ) : (
      <div className="space-y-4">
        {profile.tweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))}
      </div>
    )}
  </section>
</div>
  );
};

export default ProfilePage;
