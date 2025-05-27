import { useState } from "react";
import axios from "axios";

const ReplyBox = ({ tweetId, onReply }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `/api/tweets/${tweetId}/reply`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      onReply(res.data);
      setContent("");
    } catch (err) {
      console.error("Error replying", err);
    }
  };

  return (
    <div className="mt-2">
      <textarea
        className="w-full border p-2 rounded-md text-sm"
        rows="2"
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-1 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
      >
        Reply
      </button>
    </div>
  );
};

export default ReplyBox;
