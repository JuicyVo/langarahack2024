import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile

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

    with tempfile.TemporaryDirectory() as temp_dir:
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(URLS[0], download=True)
                title = info['title']
                filename = ydl.prepare_filename(info).rsplit(".", 1)[0] + ".mp3"
               
                error_code = ydl.download(URLS[0])

                return FileResponse(
                    filename,
                    media_type="audio/mpeg",
                    filename=f"{title}.mp3"
                )
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "YouTube Audio Downloader API"}