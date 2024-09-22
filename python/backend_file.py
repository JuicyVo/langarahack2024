import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os

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

# Specify the relative path for saving MP3 files
VIDEOS_FOLDER = "../hackathon2024/public/videos"

# Ensure the videos folder exists
os.makedirs(VIDEOS_FOLDER, exist_ok=True)

@app.post("/submit-link")
def get_audio(link: YouTubeLink):
    URLS = [link.youtubeLink]

    ydl_opts = {
        'format': 'm4a/bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
        'outtmpl': os.path.join(VIDEOS_FOLDER, '%(title)s.%(ext)s')
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(URLS[0], download=True)
            filename = ydl.prepare_filename(info).rsplit(".", 1)[0] + ".mp3"
            
        return {"message": "Download completed", "filename": os.path.basename(filename)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audio/{filename}")
async def get_audio_file(filename: str):
    file_path = os.path.join(VIDEOS_FOLDER, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg", filename=filename)
    else:
        raise HTTPException(status_code=404, detail="File not found")