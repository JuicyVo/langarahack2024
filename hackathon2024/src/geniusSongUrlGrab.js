const https = require('https');
const accessToken = "uUcQHmNpRI3Z1tnGvraxDAt3HlaFVJuFENEs_5BKsnKUp6zGGbdYq-S7ZOLoXpRW"

async function searchSongs(songName, artistName) {
  const songTitle = `${songName} by ${artistName}`;
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
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        const hits = response.response.hits;

        if (hits.length === 0) {
          console.log(`No results found for "${songTitle}".`);
          resolve(null); // Resolve with null if no results
          return;
        }

        let foundUrl = null;

        hits.forEach(hit => {
          const fullTitle = hit.result.full_title;

          // Check for the official song
          if (!fullTitle.toLowerCase().includes('cover') && 
              !fullTitle.toLowerCase().includes('genius') && 
              fullTitle.toLowerCase().includes(songName.toLowerCase()) && 
              fullTitle.toLowerCase().includes(artistName.toLowerCase())
          ) {
            foundUrl = hit.result.url; // Store the found URL
          }
        });

        if (foundUrl) {
          resolve(foundUrl); // Resolve with the found URL
        } else {
          console.log(`No matching official song found for "${songTitle}".`);
          resolve(null); // Resolve with null if no matching song found
        }
      });
    }).on('error', (e) => {
      console.error('Error:', e);
      reject(e); // Reject on error
    });
  });
}

// Example usage
searchSongs('Hello', 'Adele').then(url => {
  if (url) {
    console.log(url); // Log the URL if found
  }
});

// 'Hello', 'Adele' would bring up
//https://genius.com/Kidz-bop-kids-hello-adele-lyrics as a response

