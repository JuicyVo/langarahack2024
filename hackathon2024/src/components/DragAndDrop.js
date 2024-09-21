import { useState } from "react";
import { FiFilePlus } from "react-icons/fi";


export const DragAndDrop = () => {
  // State to store the YouTube link
  const [youtubeLink, setYoutubeLink] = useState("");

  // Handler for dropping the link
  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");

    // Simple check to validate if the dropped data is a YouTube link
    if (data.includes("youtube.com/watch?v=")) {
      setYoutubeLink(data);
    } else {
      alert("Please drop a valid YouTube link.");
    }
  };

  // Handler for when dragging over the drop area
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle manual input of YouTube link
  const handleInputChange = (e) => {
    setYoutubeLink(e.target.value);
  };

  return (
    <div className="app">
      <h1>Drag and Drop YouTube Link</h1>

      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {youtubeLink ? (
          <p>Link saved: {youtubeLink}</p>
        ) : (
          <p>Drag a YouTube link here or input manually below.</p>
        )}
      </div>

      <input
        type="text"
        placeholder="Enter YouTube link manually"
        value={youtubeLink}
        onChange={handleInputChange}
        className="youtube-input"
      />
    </div>
  );
};
