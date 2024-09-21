import yt_dlp
from fastapi import FastAPI
from pydantic import BaseModel


from fastapi.middleware.cors import CORSMiddleware

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
def get_audio(link: YouTubeLink):
    URLS = [link.youtubeLink]

    ydl_opts = {
        'format': 'm4a/bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        error_code = ydl.download(URLS)

    return {"message": "Download started", "youtubeLink": link.youtubeLink}