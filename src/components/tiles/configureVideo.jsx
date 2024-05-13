// components/tiles/ConfigureVideo.js

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify";

const ConfigureVideo = ({ line, index, handleLineUpdate }) => {
  const [videoUrl, setVideoUrl] = useState(line.url || "");

  useEffect(() => {
    const sanitizedUrl = sanitizeUrl(videoUrl);
    handleLineUpdate(index, { ...line, url: sanitizedUrl });
  }, [videoUrl]);

  const sanitizeUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtu.be") {
        return DOMPurify.sanitize(url);
      }
    } catch (error) {
      console.error("Invalid URL", error);
    }
    return "";
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold">YouTube URL</label>
      <Input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter YouTube URL"
        className="w-full py-1 px-2 text-sm border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {!sanitizeUrl(videoUrl) && videoUrl && (
        <div className="text-red-500 text-sm mt-1">Invalid YouTube URL</div>
      )}
    </div>
  );
};

export default ConfigureVideo;
