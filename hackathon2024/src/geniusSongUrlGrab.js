const axios = require('axios');
const { load } = require('cheerio');

const accessToken = "vYcNHxDp7Xss4sCYb1POO8NmLgqiVg49npa2YE8U4HKCaaOvNkktTGtqGcAl8XRc";

async function searchSongs(songName, artistName) {
  const songTitle = `${songName} by ${artistName}`;
  console.log(`Searching for "${songTitle}"...`);

  const url = `https://api.genius.com/search?q=${encodeURIComponent(songTitle)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const hits = response.data.response.hits;

    if (hits.length === 0) {
      console.log(`No results found for "${songTitle}".`);
      return null;
    }

    let foundUrl = null;

    for (const hit of hits) {
      const fullTitle = hit.result.full_title;

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

module.exports = { searchSongs };
