from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from pymysql import cursors
import pymysql
from pydantic import BaseModel
from datetime import datetime
from typing import List
import os
import asyncio

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

password = os.environ.get("MYSQL_ROOT_PASSWORD")
db_name = os.environ.get("MYSQL_DATABASE")

class PlaylistCreate(BaseModel):
    title: str
    author: str
    genre: str

class Playlist(PlaylistCreate):
    id: int
    createdAt: datetime
    modifiedAt: datetime

class PlaylistUpdate(BaseModel):
    title: str
    author: str
    genre: str

def create_initial_schema(cursor):
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS playlist (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(255) NOT NULL,
        createdAt DATETIME,
        modifiedAt DATETIME
    );
    """
    cursor.execute(create_table_sql)

async def refresh_db_session():
    while True:
        await asyncio.sleep(30)
        connection.ping(reconnect=True)

@app.on_event("startup")
async def startup_db():
    global connection
    connection = pymysql.connect(
        host="playlistdb-svc",
        port=3306,
        user="root",
        password=password,
        db=db_name,
        cursorclass=cursors.DictCursor
    )
    create_initial_schema(connection.cursor())
    asyncio.create_task(refresh_db_session())

@app.on_event("shutdown")
async def shutdown_db():
    connection.close()

@app.get("/playlist", response_model=List[Playlist])
async def read_all_playlists():
    with connection.cursor() as cursor:
        query = "SELECT * FROM playlist"
        cursor.execute(query)
        playlists = cursor.fetchall()
        return playlists

@app.post("/playlist", response_model=Playlist)
async def create_playlist(playlist: PlaylistCreate):
    with connection.cursor() as cursor:
        query = "INSERT INTO playlist (title, author, genre, createdAt, modifiedAt) VALUES (%s, %s, %s, NOW(), NOW())"
        cursor.execute(query, (playlist.title, playlist.author, playlist.genre))
        connection.commit()
        last_record_id = cursor.lastrowid
        playlist_data = playlist.dict()
        playlist_data["id"] = last_record_id
        playlist_data["createdAt"] = datetime.now()
        playlist_data["modifiedAt"] = datetime.now()
    return playlist_data

@app.get("/playlist/{playlist_id}", response_model=Playlist)
async def read_playlist(playlist_id: int):
    with connection.cursor() as cursor:
        query = "SELECT * FROM playlist WHERE id = %s"
        cursor.execute(query, (playlist_id,))
        result = cursor.fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="Playlist not found")
        return result

@app.put("/playlist/{playlist_id}", response_model=Playlist)
async def update_playlist(playlist_id: int, playlist: PlaylistUpdate):
    with connection.cursor() as cursor:
        query = "UPDATE playlist SET title = %s, author = %s, genre = %s, modifiedAt = NOW() WHERE id = %s"
        cursor.execute(query, (playlist.title, playlist.author, playlist.genre, playlist_id))
        connection.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Playlist not found")
    
    with connection.cursor() as cursor:
        query = "SELECT * FROM playlist WHERE id = %s"
        cursor.execute(query, (playlist_id,))
        result = cursor.fetchone()

    return result

@app.delete("/playlist/{playlist_id}", response_model=dict)
async def delete_playlist(playlist_id: int):
    with connection.cursor() as cursor:
        query = "DELETE FROM playlist WHERE id = %s"
        cursor.execute(query, (playlist_id,))
        connection.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Playlist not found")
    return {"message": "Playlist deleted successfully"}

