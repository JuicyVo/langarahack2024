import { useState } from "react";
import axios from "axios";
// If Loading.js and InputComponent.js use named exports:
import { Loading } from "./Loading.js"; // Use named import
import { InputComponent } from "./InputComponent.js"; // Use named import

export const DragAndDrop = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisplaying, setIsDisplaying] = useState(false);

  const toggleLoading = () => {
    isLoading ? setIsLoading(false) : setIsLoading(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");

    if (data.includes("youtube.com/watch?v=")) {
      setYoutubeLink(data);
      handleSubmit();
    } else {
      alert("Please drop a valid YouTube link.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    setYoutubeLink(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    toggleLoading();

    try {
      // Send YouTube link to FastAPI backend using Axios
      const response = await axios.post(
        "http://127.0.0.1:8000/submit-link/",
        { youtubeLink: youtubeLink },
        {
          mode: "no-cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      console.log("Response from backend:", response);
      setIsDisplaying(true);
    } catch (error) {
      console.error("Error submitting the link:", error);
    }
  };

  const handleReset = () => {
    setIsDisplaying(false); // Switch back to input mode
    setYoutubeLink(""); // Reset YouTube link
  };

  return (
    <div className="mx-auto flex flex-col items-center p-6 bg-secondary min-h-screen justify-center">
      {isLoading ? (
        <Loading />
      ) : isDisplaying ? (
        // <DisplayComponent onReset={handleReset} />
        <div></div>
      ) : (
        // InputComponent for entering or dropping the YouTube link
        <InputComponent
          youtubeLink={youtubeLink}
          handleInputChange={handleInputChange}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
