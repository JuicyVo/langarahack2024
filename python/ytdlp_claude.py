import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import io
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
            logger.info(f"Extracting info for URL: {URLS[0]}")
            info = ydl.extract_info(URLS[0], download=False)
            title = info['title']
            logger.info(f"Video title: {title}")

            audio_buffer = io.BytesIO()
            
            def download_callback(d):
                if d['status'] == 'finished':
                    audio_file = d['filename']
                    logger.info(f"Download finished, reading file: {audio_file}")
                    with open(audio_file, 'rb') as f:
                        audio_buffer.write(f.read())
            
            ydl_opts['progress_hooks'] = [download_callback]
            logger.info("Starting download")
            ydl.download(URLS)
            
            audio_buffer.seek(0)
            logger.info(f"Audio buffer size: {audio_buffer.getbuffer().nbytes} bytes")

            def iterfile():
                yield from audio_buffer
            
            logger.info("Preparing streaming response")
            return StreamingResponse(
                iterfile(),
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": f'attachment; filename="{title}.mp3"',
                    "X-YouTube-Title": title
                }
            )
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "YouTube Audio Downloader API"}