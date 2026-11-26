import sqlite3
import os

DATABASE = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data",
    "netwatch.db"
)


def get_connection():
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)

    connection = sqlite3.connect(DATABASE)
    connection.execute("PRAGMA foreign_keys = ON")
    connection.row_factory = sqlite3.Row

    return connection


def create_table():
    connection = get_connection()

    # Devices table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ip_address TEXT NOT NULL,
            device_type TEXT NOT NULL
        )
    """)

    # Monitoring history table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS check_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id INTEGER NOT NULL,
            status TEXT NOT NULL,
            latency REAL,
            checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (device_id) REFERENCES devices(id)
            ON DELETE CASCADE
        )
    """)

    connection.commit()
    connection.close()