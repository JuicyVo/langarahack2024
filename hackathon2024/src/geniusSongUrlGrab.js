import axios from 'axios';
import { load } from 'cheerio';

const accessToken = "qc6QdLcSdIaWxuxfFbfI36gbYlkxIbM4Yr2QAyAxY5F_GdwRiqge4ASD-CuFzy8y";

export async function searchSongs(songName, artistName) {
  const songTitle = `${songName} by ${artistName}`;
  console.log(`Searching for "${songTitle}"...`);

  const url = `http://localhost:5001/search?songName=${encodeURIComponent(songName)}&artistName=${encodeURIComponent(artistName)}`;

  try {
    const response = await axios.get(url); // Fetch from your Express server

    if (!response.data || !response.data.lyrics) {
      console.error(`No valid response for "${songTitle}".`);
      return null;
    }

    // Return both the song URL and the lyrics
    return { url: response.data.songUrl, lyrics: response.data.lyrics };

  } catch (error) {
    console.error('Error searching songs:', error);
    return null;
  }
}



export async function extractLyrics(url) {
  try {
    const response = await axios.get(url); // Fetch page content using Axios
    const $ = load(response.data); // Load HTML into Cheerio

    const lyricsContainer = $('[data-lyrics-container="true"]'); // Select lyrics container

    // Replace <br> with newline for proper formatting
    $("br", lyricsContainer).replaceWith("\n");

    // Replace <a> tags with their text contents
    $("a", lyricsContainer).replaceWith((_i, el) => $(el).text());

    // Extract plain text from the lyrics container
    return lyricsContainer.text().trim();
  } catch (error) {
    console.error('Error extracting lyrics:', error);
    return null;
  }
}
