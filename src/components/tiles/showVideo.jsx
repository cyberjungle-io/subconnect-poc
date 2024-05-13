// components/tiles/showVideo.js

import React from "react";
import DOMPurify from "dompurify";

const ShowVideo = ({ line }) => {
  let videoId = "";

  // Extract video ID from the URL
  try {
    const url = new URL(DOMPurify.sanitize(line.url));
    videoId = url.searchParams.get("v") || url.pathname.split("/").pop();
  } catch (error) {
    console.error("Invalid video URL", error);
  }

  if (!videoId) {
    console.error("No video ID found in URL", line.url);
    return <div className="text-red-500">Invalid Video URL</div>;
  }

  return (
    <div className="relative pb-16/9 h-0 overflow-hidden" style={{ paddingBottom: "56.25%",  backgroundColor: "#f0f0f0" }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full "
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin"
        title="YouTube video"
      ></iframe>
    </div>
  );
};

export default ShowVideo;
