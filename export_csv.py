import sqlite3
import csv

conn = sqlite3.connect("responses.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM responses")
rows = cursor.fetchall()

with open("responses.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["ID", "Question ID", "File Path", "Transcription", "Timestamp"])
    writer.writerows(rows)

print("✅ Exported to responses.csv")
conn.close()
