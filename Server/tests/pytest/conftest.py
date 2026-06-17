import pytest
import sqlite3
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app import app as flask_app, get_db_connection, init_db

@pytest.fixture(scope="function")
def app():
    # Provide the Flask app for testing
    flask_app.config['TESTING'] = True
    flask_app.config['DATABASE'] = ':memory:'
    
    with flask_app.app_context():
        init_db()
    yield flask_app

@pytest.fixture(scope="function")
def client(app):
    # Flask test client
    return app.test_client()

@pytest.fixture(scope="function")
def db_connection():
    """
    Provides a DB connection for tests. Rollback any changes after each test.
    """
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            publisher TEXT NOT NULL,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            Cost REAL NOT NULL
        )
    ''')
    conn.commit()
    
    yield conn, cursor
    
    conn.close()

@pytest.fixture(scope="function")
def create_sample_book(db_connection):
    """
    Fixture to create a sample book for testing update/delete/fetch.
    Returns the inserted book id.
    """
    conn, cursor = db_connection
    cursor.execute(
        "INSERT INTO book (publisher, name, date, Cost) VALUES (?, ?, ?, ?)",
        ("TestPub", "TestBook", "2025-01-01", 50.0)
    )
    book_id = cursor.lastrowid
    conn.commit()
    yield book_id
    cursor.execute("DELETE FROM book WHERE id=?", (book_id,))
    conn.commit()
