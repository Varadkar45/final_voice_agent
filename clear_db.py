import sqlite3

conn = sqlite3.connect("responses.db")
cursor = conn.cursor()

# Delete all rows from the table
cursor.execute("DELETE FROM responses")

conn.commit()
conn.close()

print("✅ All responses deleted.")
