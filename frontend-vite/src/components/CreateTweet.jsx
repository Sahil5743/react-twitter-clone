import { useState } from "react";
import axios from "axios";

const CreateTweet = ({ onTweetCreated }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Tweet content cannot be empty.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tweets",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContent("");
      onTweetCreated();
    } catch (err) {
      console.error(err);
      setError("Failed to post tweet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#15202b] text-white p-5 rounded-xl shadow-md border border-gray-700 mb-6"
      aria-label="Create a new tweet"
    >
      <div className="flex space-x-4">
        {/* Optional avatar slot for realism */}
        <img
          src="https://via.placeholder.com/48"
          alt="User avatar"
          className="w-12 h-12 rounded-full object-cover border border-gray-600"
        />
        <div className="flex-1">
          <textarea
            className="w-full bg-transparent border-none text-lg resize-none placeholder-gray-400 focus:outline-none focus:ring-0"
            placeholder="What is happening?!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            aria-required="true"
            aria-describedby="tweet-error"
            rows={3}
            disabled={isSubmitting}
          />
          {error && (
            <p
              id="tweet-error"
              className="mt-1 text-sm text-red-500"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          )}
          <div className="mt-3 text-right">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className={`bg-blue-500 text-white px-5 py-2 rounded-full font-bold transition ${
                isSubmitting || !content.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Tweeting..." : "Tweet"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateTweet;
