import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from audio_separator.separator import Separator
import logging
import glob

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

DOWNLOADS_FOLDER = "./downloads"
os.makedirs(DOWNLOADS_FOLDER, exist_ok=True)
app.mount("/downloads", StaticFiles(directory=DOWNLOADS_FOLDER), name="downloads")

separator = Separator(
    model_file_dir="/tmp/audio-separator-models/",
    output_dir=DOWNLOADS_FOLDER,
    output_format="mp3",
    normalization_threshold=0.9,
    output_single_stem="Instrumental",
    sample_rate=44100,
    mdx_params={
        "hop_length": 1024,
        "segment_size": 256,
        "overlap": 0.25,
        "batch_size": 8
    }
)

separator.load_model(model_filename="UVR-MDX-NET-Inst_HQ_1.onnx")

@app.post("/submit-link")
async def get_audio(link: YouTubeLink):
    logger.info(f"Processing YouTube link: {link.youtubeLink}")
    
    ydl_opts = {
        'format': 'm4a/bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
        'outtmpl': os.path.join(DOWNLOADS_FOLDER, '%(title)s.%(ext)s')
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(link.youtubeLink, download=True)
        original_filename = ydl.prepare_filename(info).rsplit(".", 1)[0] + ".mp3"

        youtube_title = os.path.basename(original_filename)
        
        output_files = separator.separate(original_filename)
        
        # Find the instrumental file
        instrumental_files = glob.glob(os.path.join(DOWNLOADS_FOLDER, f"*{youtube_title.rsplit('.', 1)[0]}*Instrumental*.mp3"))
        if not instrumental_files:
            raise HTTPException(status_code=404, detail="Instrumental file not found")
        instrumental_file = instrumental_files[0]
        
        # Remove the original MP3 if it exists
        if os.path.exists(original_filename):
            os.remove(original_filename)
        
        # Rename the vocal-removed file to match the original YouTube title
        new_filename = os.path.join(DOWNLOADS_FOLDER, youtube_title)
        os.rename(instrumental_file, new_filename)
        
        file_url = f"/downloads/{youtube_title}"
        
    return JSONResponse(content={"message": "Processing completed", "file_url": file_url})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)