import sqlite3

conn = sqlite3.connect("responses.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM responses")
rows = cursor.fetchall()

print("Responses in DB:")
for row in rows:
    print(
        f"ID: {row[0]} | Q#: {row[1]} | File: {row[2]} | Text: {row[3]} | Time: {row[4]}"
    )

conn.close()
