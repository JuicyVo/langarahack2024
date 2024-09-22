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
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />
      <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <div>
        <input
          type="range"
          min="0"
          max={audioRef.current?.duration || 0}
          step="0.1"
          onChange={(e) => {
            audioRef.current.currentTime = e.target.value;
          }}
        />
      </div>
    </div>
  );
};
