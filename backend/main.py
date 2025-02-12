import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup

app = FastAPI()

# CORSミドルウェアを追加（フロントエンドのURLに更新する必要があります）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://v0-juzvbzcy3ph.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/scrape")
async def scrape_images(url: str):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    images = []
    for img in soup.find_all('img'):
        src = img.get('src')
        alt = img.get('alt', '')
        if src:
            images.append({"src": src, "alt": alt})
    return {"images": images}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)