
const axios = require('axios');

const openAiToken = ''; // Replace with your actual API key
const title = "rihanna karaoke umbrella"

async function getSongDetails(title) {
  const prompt = `Extract the artist name and song title from the following text: "${title}".
  Format the response as:
  Artist: <artist_name>
  Song: <song_name>`;
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${openAiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const completion = response.data.choices[0].text.trim();
    console.log(completion);
    
  } catch (error) {
    console.error("Error fetching data from OpenAI:", error);
  }
}



getSongDetails(title);
