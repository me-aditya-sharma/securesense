import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "securesense.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        input_type TEXT NOT NULL,
        title TEXT,
        input_text TEXT,
        audio_filename TEXT,
        risk_level TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        confidence TEXT NOT NULL,
        categories TEXT NOT NULL, -- JSON string
        evidence TEXT NOT NULL,   -- JSON string
        recommended_actions TEXT NOT NULL, -- JSON string
        voice_result TEXT NOT NULL, -- JSON string
        redacted_preview TEXT
    )
    """)
    conn.commit()
    conn.close()

init_db()
