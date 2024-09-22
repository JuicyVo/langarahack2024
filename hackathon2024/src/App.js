import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragAndDrop } from "./components/DragAndDrop.js";

import "./App.css";

function App() {
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);

  // Automatically search for "Hello" by Adele when the component mounts
  useEffect(() => {
    const searchForHello = async () => {
      setLoading(true);
      
      try {
        const response = await axios.get(`http://localhost:5001/search?songName=Hello&artistName=Adele`);
        
        if (response.data) {
          const { songUrl, lyrics } = response.data;
          setLyrics(lyrics || "No lyrics found.");
        } else {
          setLyrics("No URL found.");
        }
      } catch (error) {
        console.error("Error fetching song:", error);
        setLyrics("Error fetching lyrics.");
      }
      
      setLoading(false);
    };
  
    searchForHello(); // Call it once
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="App">
      <h1>Song Lyrics Finder</h1>
      <DragAndDrop />
      {loading ? <p>Loading...</p> : <pre>{lyrics}</pre>}
    </div>
  );
}

export default App;
