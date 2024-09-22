function extractSongAndArtist(title) {
  // Clean the title
  const cleanedTitle = title
    .replace(/(official music video|mp3|video|\(.*?\))/gi, '') // Remove specific words and anything in parentheses
    .trim();

  // Split the title by common delimiters
  const parts = cleanedTitle.split(/[-—]/).map(part => part.trim());

  let artistName = '';
  let songName = '';

  // Assign values based on the number of parts
  if (parts.length === 2) {
    artistName = parts[0];
    songName = parts[1];
  } else if (parts.length === 1) {
    songName = parts[0]; // Only one part available
  }

  // Capitalize names for better presentation
  artistName = artistName.charAt(0).toUpperCase() + artistName.slice(1);
  songName = songName.charAt(0).toUpperCase() + songName.slice(1);

  return { artistName, songName };
}

// Example usage
// const title = "rihanna - umbrella (Official Music Video).mp3";
// const { artistName, songName } = extractSongAndArtist(title);
// console.log(`Artist: ${artistName}, Song: ${songName}`);
