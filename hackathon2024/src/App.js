import React, { useState, useEffect } from "react";
import { searchSongs, extractLyrics } from "./geniusSongUrlGrab"; // Ensure this matches the file name
import { DragAndDrop } from "./components/DragAndDrop";

import "./App.css";

function App() {
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);

  // Automatically search for "Hello" by Adele when the component mounts
  useEffect(() => {
    const searchForHello = async () => {
      setLoading(true);
      const url = await searchSongs("Hello", "Adele");
      if (url) {
        const fetchedLyrics = await extractLyrics(url);
        setLyrics(fetchedLyrics);
      }
      setLoading(false);
    };
    
    searchForHello();
  }, []);

  return (
    <div className="App">
      <h1>Song Lyrics Finder</h1>
      <DragAndDrop />
      {loading ? <p>Loading...</p> : <pre>{lyrics}</pre>}
    </div>
  );
}

export default App; // Make sure this line is present
