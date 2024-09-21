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
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Drag and Drop YouTube Link</h1>

      <div
        className="w-80 p-6 border-2 border-dashed border-gray-500 bg-white rounded-md text-center mb-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {youtubeLink ? (
          <p className="text-gray-700">Link saved: {youtubeLink}</p>
        ) : (
          <p className="text-gray-400">
            Drag a YouTube link here or input manually below.
          </p>
        )}
      </div>

      <input
        type="text"
        placeholder="Enter YouTube link manually"
        value={youtubeLink}
        onChange={handleInputChange}
        className="w-80 p-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};
