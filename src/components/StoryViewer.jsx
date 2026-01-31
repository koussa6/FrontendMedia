import React, { useEffect, useState } from 'react';
import { BadgeCheck, X } from 'lucide-react';

const StoryViewer = ({ viewStory, setViewStory }) => {
  const isVerified = viewStory.user?.is_verified;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let timer, progressInterval;
    if (viewStory && viewStory.media_type !== 'video') {
      setProgress(0);
      const duration = 5000;
      const setTime = 100;
      let elapsed = 0;
      progressInterval = setInterval(() => {
        elapsed += setTime;
        setProgress((elapsed / duration) * 100);
      }, setTime);
      timer = setTimeout(() => {
        setViewStory(null);
      }, duration);
    }
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [viewStory, setViewStory]);
  if (!viewStory) return null;
  return (
    <div
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black"
      style={{
        background:
          viewStory.media_type === 'text' ? viewStory.background_color : '#000',
      }}
    >
      {/* Progress Bar - Fixed the width unit to '%' */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700/50 z-20">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header Info */}
      <div className="absolute top-6 flex w-full min-w-full justify-between ">
        <div className="flex items-center relative left-4 space-x-3 p-2 px-4 backdrop-blur-md rounded-full bg-black/40">
          <img
            src={viewStory.user?.profile_picture}
            alt=""
            className="size-8 rounded-full object-cover border border-white/50"
          />
          <div className="text-white font-medium flex items-center gap-1">
            <span className="text-sm sm:text-base">
              {viewStory.user?.full_name}
            </span>
            {/* Conditional Rendering for the Badge */}
            {isVerified && (
              <BadgeCheck
                size={18}
                className="text-blue-400 fill-blue-400/20 flex-shrink-0"
              />
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setViewStory(null)}
          className="p-2 text-white/80 hover:text-white relative right-4"
        >
          <X size={28} />
        </button>
      </div>

      {/* Story Content Rendering */}
      <div className=" h-full flex items-center justify-center w-full min-w-full p-8">
        {viewStory.media_type === 'text' ? (
          <p className="text-white text-2xl sm:text-3xl font-bold text-center ">
            {viewStory.content}
          </p>
        ) : viewStory.media_type === 'image' ? (
          <img
            src={viewStory.media_url}
            className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
            alt="Story"
          />
        ) : (
          <video
            onEnded={() => setViewStory(null)}
            src={viewStory.media_url}
            autoPlay
            controls
            className="max-h-[80vh] w-auto rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
