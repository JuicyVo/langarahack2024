const https = require('https');
const axios = require('axios');

const cheerio = require('cheerio');

const accessToken = "uUcQHmNpRI3Z1tnGvraxDAt3HlaFVJuFENEs_5BKsnKUp6zGGbdYq-S7ZOLoXpRW";
async function searchSongs(songName, artistName) {
  const songTitle = `${songName} by ${artistName}`;
  console.log(`Searching for "${songTitle}"...`);
  const options = {
      hostname: 'api.genius.com',
      path: `/search?q=${encodeURIComponent(songTitle)}`,
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  };

  return new Promise((resolve, reject) => {
      https.get(options, (res) => {
          console.log(`Response status code: ${res.statusCode}`);
          let data = '';

          res.on('data', (chunk) => {
              data += chunk;
          });

          res.on('end', () => {
              // console.log('Raw response data:', data);
              const response = JSON.parse(data);
              const hits = response.response.hits;

              if (hits.length === 0) {
                  console.log(`No results found for "${songTitle}".`);
                  resolve(null);
                  return;
              }

              let foundUrl = null;

              for (const hit of hits) {
                  const fullTitle = hit.result.full_title;

                  if (
                      fullTitle.toLowerCase().includes(songName.toLowerCase()) &&
                      fullTitle.toLowerCase().includes(artistName.toLowerCase()) &&
                      !fullTitle.toLowerCase().includes('cover') &&
                      !fullTitle.toLowerCase().includes('kidz bop') &&
                      !fullTitle.toLowerCase().includes('genius')
                  ) {
                      foundUrl = hit.result.url;
                      break;
                  }
              }

              if (foundUrl) {
                  resolve(foundUrl);
              } else {
                  console.log(`No matching official song found for "${songTitle}".`);
                  resolve(null);
              }
          });
      }).on('error', (e) => {
          console.error('Error:', e);
          reject(e);
      });
  });
}
async function extractLyrics(url) {
  try {
    const response = await axios.get(url); // Fetch page content using Axios
    const $ = cheerio.load(response.data); // Load HTML into Cheerio

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

searchSongs('Umbrella', 'Rihanna')
  .then(url => {
    if (url) {
      console.log('Found URL:', url); // Log the Genius song URL if found
      return extractLyrics(url); // Extract lyrics from the found URL
    } else {
      console.log('No URL found.');
      return null;
    }
  })
  .then(lyrics => {
    if (lyrics) {
      console.log('Lyrics:', lyrics); // Log the extracted lyrics
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });