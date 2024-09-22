import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
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

# Specify the path for saving MP3 files
VIDEOS_FOLDER = "./downloads"

# Ensure the videos folder exists
os.makedirs(VIDEOS_FOLDER, exist_ok=True)

# Mount the downloads directory
app.mount("/downloads", StaticFiles(directory=VIDEOS_FOLDER), name="downloads")

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
            relative_path = os.path.relpath(filename, VIDEOS_FOLDER)
            file_url = f"/downloads/{relative_path}"
            
        return JSONResponse(content={"message": "Download completed", "file_url": file_url})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))