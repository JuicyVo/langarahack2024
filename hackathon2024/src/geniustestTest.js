const { searchSongs, extractLyrics } = require('./geniusSongUrlGrab');

async function test() {
  const url = await searchSongs("Hello", "Adele");
  console.log(url ? `Found URL: ${url}` : 'No URL found');

  if (url) {
    const lyrics = await extractLyrics(url);
    console.log(lyrics ? `Lyrics:\n${lyrics}` : 'No lyrics found.');
  }
}

test();