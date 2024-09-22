import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class YouTubeLink(BaseModel):
    youtubeLink: str

@app.post("/submit-link")
async def get_audio(link: YouTubeLink):
    URLS = [link.youtubeLink]

    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': '%(title)s.%(ext)s',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(URLS[0], download=False)
            title = info['title']
            audio_buffer = io.BytesIO()
            
            def download_callback(d):
                if d['status'] == 'finished':
                    audio_file = d['filename']
                    with open(audio_file, 'rb') as f:
                        audio_buffer.write(f.read())
            
            ydl_opts['progress_hooks'] = [download_callback]
            ydl.download(URLS)
            
            audio_buffer.seek(0)
            
            # Create a streaming response for the audio file
            audio_response = StreamingResponse(
                audio_buffer,
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": f'attachment; filename="{title}.mp3"',
                    "X-YouTube-Title": title  # Add the title as a custom header
                }
            )
            
            return audio_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "YouTube Audio Downloader API"}