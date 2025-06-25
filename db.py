# db.py
import sqlite3


def init_db():
    conn = sqlite3.connect("responses.db")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER,
            audio_file TEXT,
            transcription TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def save_response(question_id, audio_file, transcription):
    conn = sqlite3.connect("responses.db")
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO responses (question_id, audio_file, transcription)
        VALUES (?, ?, ?)
    """,
        (question_id, audio_file, transcription),
    )
    conn.commit()
    conn.close()


def get_all_responses():
    conn = sqlite3.connect("responses.db")
    cur = conn.cursor()
    cur.execute("SELECT question_id, transcription, timestamp FROM responses")
    rows = cur.fetchall()
    conn.close()
    return rows
