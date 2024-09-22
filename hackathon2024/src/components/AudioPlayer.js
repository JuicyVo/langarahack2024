import React, { useRef, useState } from "react";

export const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    // You can add functionality here to update the progress bar if needed
  };

  return (
    <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlayPause}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min="0"
          max={audioRef.current?.duration || 0}
          step="0.1"
          onChange={(e) => {
            audioRef.current.currentTime = e.target.value;
          }}
          className="w-full h-2 bg-gray-600 rounded appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};
