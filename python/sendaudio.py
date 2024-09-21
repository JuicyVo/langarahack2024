from fastapi import FastAPI, HTTPException, Form
from pydantic import BaseModel
from fastapi.responses import FileResponse
import yt_dlp
import os
import uuid

app = FastAPI()

# Directory to store downloaded files temporarily
DOWNLOAD_DIR = "downloads"

# Ensure the directory exists
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

class YouTubeLink(BaseModel):
    url: str

@app.post("/download-audio")
async def download_audio(url: str = Form(...)):
    # Create a unique filename
    output_filename = f"{DOWNLOAD_DIR}/{uuid.uuid4()}.mp3"

    # yt-dlp options
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_filename,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        # Check if the file was created successfully
        if not os.path.exists(output_filename):
            raise HTTPException(status_code=500, detail="Error downloading the audio file")

        # Return the audio file as a response
        return FileResponse(output_filename, media_type='audio/mpeg', filename=os.path.basename(output_filename))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up the file after sending (optional, depends on your use case)
        if os.path.exists(output_filename):
            os.remove(output_filename)

# To run the app use the command: uvicorn main:app --reload