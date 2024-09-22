// InputComponent.js
import { FiFilePlus } from "react-icons/fi";

export const InputComponent = ({
  youtubeLink,
  handleInputChange,
  handleDrop,
  handleDragOver,
  handleSubmit,
}) => {
  return (
    <div>
      <div
        className="w-full p-6 border-2 border-dashed border-gray-500 rounded-md text-center mb-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {youtubeLink ? (
          <p className="text-gray-700">Link saved: {youtubeLink}</p>
        ) : (
          <div>
            <FiFilePlus className="text-gray-500 mx-auto text-7xl" />
            <p className="text-gray-500">Drop Youtube URLs to play here</p>
          </div>
        )}
      </div>

      <div className="flex align-middle justify-center gap-2">
        <input
          type="text"
          placeholder="Enter YouTube URL manually"
          value={youtubeLink}
          onChange={handleInputChange}
          className="w-80 p-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={handleSubmit}
          className="bg-primary text-white p-2 rounded-md shadow-lg"
        >
          Submit Link
        </button>
      </div>
    </div>
  );
};
