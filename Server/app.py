from flask import Flask, jsonify, request, g
from flask_cors import CORS
import sqlite3
import os
import jwt
import datetime
import functools
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Secret for signing JWTs; override with env var in production
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

DB_PATH = os.path.join(os.path.dirname(__file__), 'books.db')

def get_db_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def init_db():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            publisher TEXT NOT NULL,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            Cost REAL NOT NULL
        )
    ''')
    # Create users table for authentication
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    connection.commit()
    connection.close()


def generate_token(user_id, expires_in=3600):
    payload = {
        'sub': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    # PyJWT returns a str in v2+, ensure str
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token


def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return jsonify({'error': 'Authorization header missing'}), 401
        parts = auth.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return jsonify({'error': 'Invalid Authorization header format'}), 401
        token = parts[1]
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            g.current_user = data.get('sub')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/', methods=['GET'])
def get_books():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM book")
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([dict(row) for row in rows])

@app.route('/create', methods=['POST'])
@token_required
def create_books():
    new_book = request.get_json()
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO book (publisher, name, date, Cost) VALUES (?, ?, ?, ?)",
        (new_book['publisher'], new_book['name'], new_book['date'], new_book['Cost'])
    )
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify(new_book), 201

@app.route('/update/<int:id>', methods=['PUT'])
def update_book(id):
    updated_book = request.get_json()
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE book SET publisher=?, name=?, date=?, Cost=? WHERE id=?",
        (updated_book['publisher'], updated_book['name'], updated_book['date'], updated_book['Cost'], id)
    )
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify(updated_book)

@app.route('/delete/<int:id>', methods=['DELETE'])
@token_required
def delete_book(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM book WHERE id=?", (id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'result': 'Book deleted'})


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'username and password required'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE username=?", (username,))
    if cur.fetchone():
        conn.close()
        return jsonify({'error': 'username already exists'}), 400
    password_hash = generate_password_hash(password)
    cur.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    token = generate_token(user_id)
    return jsonify({'id': user_id, 'username': username, 'token': token}), 201


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'username and password required'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, password_hash FROM users WHERE username=?", (username,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'invalid credentials'}), 401
    user_id, password_hash = row['id'], row['password_hash']
    if not check_password_hash(password_hash, password):
        return jsonify({'error': 'invalid credentials'}), 401
    token = generate_token(user_id)
    return jsonify({'id': user_id, 'username': username, 'token': token})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001)
