import React from "react";

export default function Tweet({ tweet }) {
  const { author, content, createdAt } = tweet;
  const username = author?.username || "unknown";
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
   <article className="border border-gray-700 rounded-xl p-4 mb-4 bg-[#15202b] text-orange shadow-sm hover:bg-[#1e293b] transition-colors duration-200">
  <header className="flex items-center gap-2 mb-2">
    <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center font-bold text-black text-sm">
      @{username[0].toUpperCase()}
    </div>
    <p className="font-semibold">@{username}</p>
  </header>

  <p className="mt-1 text-orange whitespace-pre-wrap leading-relaxed">{content}</p>

  {formattedDate && (
    <time
      dateTime={createdAt}
      className="text-sm text-orange/60 mt-3 inline-block"
      aria-label={`Posted on ${formattedDate}`}
    >
      {formattedDate}
    </time>
  )}
</article>

  );
}
