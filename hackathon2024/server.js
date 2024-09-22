import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { load } from 'cheerio';

const app = express();
const port = 5001;

app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from your React app
}));

const accessToken = "qc6QdLcSdIaWxuxfFbfI36gbYlkxIbM4Yr2QAyAxY5F_GdwRiqge4ASD-CuFzy8y"; // Your access token

app.get('/search', async (req, res) => {
  const { songName, artistName } = req.query;
  console.log(`Received songName: ${songName}, artistName: ${artistName}`);

  try {
    // Fetch song URL from Genius API
    const songUrl = await searchSongs(songName, artistName);

    if (!songUrl) {
      return res.status(404).json({ message: 'No song found' });
    }

    console.log(`Found song URL: ${songUrl}`);

    // Now fetch the lyrics using the song URL
    const lyrics = await extractLyrics(songUrl);

    if (!lyrics) {
      return res.status(404).json({ message: 'No lyrics found' });
    }

    // Send the lyrics and song URL back to the client
    res.json({ songUrl, lyrics });
  } catch (error) {
    console.error('Error in search endpoint:', error);
    res.status(500).send('Error searching songs');
  }
});

async function searchSongs(songName, artistName) {
  const songTitle = `${songName} by ${artistName}`;
  console.log(`Searching for "${songTitle}"...`);

  const url = `https://api.genius.com/search?q=${encodeURIComponent(songTitle)}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const hits = response.data.response.hits;

    if (hits.length === 0) {
      console.log(`No results found for "${songTitle}".`);
      return null;
    }

    let foundUrl = null;

    for (const hit of hits) {
      const fullTitle = hit.result.full_title;

      // Check if the song and artist match
      if (
        fullTitle.toLowerCase().includes(songName.toLowerCase()) &&
        fullTitle.toLowerCase().includes(artistName.toLowerCase()) &&
        !fullTitle.toLowerCase().includes('cover') &&
        !fullTitle.toLowerCase().includes('translation') &&
        !fullTitle.toLowerCase().includes('annotated') &&
        !fullTitle.toLowerCase().includes('album') &&
        !fullTitle.toLowerCase().includes('kidz bop') &&
        !fullTitle.toLowerCase().includes('genius')
      ) {
        foundUrl = hit.result.url;
        break;
      }
    }

    return foundUrl ? foundUrl : null;

  } catch (error) {
    console.error('Error searching songs:', error);
    return null;
  }
}

async function extractLyrics(url) {
  try {
    const response = await axios.get(url); // Fetch page content using Axios
    const $ = load(response.data); // Load HTML into Cheerio

    const lyricsContainer = $('[data-lyrics-container="true"]'); // Select lyrics container

    // Replace <br> with newline for proper formatting
    $("br", lyricsContainer).replaceWith("\n");

    // Replace <a> tags with their text contents
    $("a", lyricsContainer).replaceWith((_i, el) => $(el).text());

    // Extract plain text from the lyrics container
    const lyrics = lyricsContainer.text().trim(); // Extract the lyrics

    console.log(`Extracted lyrics: ${lyrics}`); // Log the extracted lyrics

    return lyrics; // Return the extracted lyrics

  } catch (error) {
    console.error('Error extracting lyrics:', error);
    return null;
  }
}


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
