const { searchSongs } = require('./geniusSongUrlGrab');

async function test() {
  const url = await searchSongs("Hello", "Adele");
  console.log(url ? `Found URL: ${url}` : 'No URL found');
}

test();
