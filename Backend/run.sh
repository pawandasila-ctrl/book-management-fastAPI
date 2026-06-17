#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# If running locally (outside Docker) and DATABASE_URL points to MS SQL,
# fall back to SQLite to prevent missing unixodbc/pyodbc driver errors.
if [ ! -f /.dockerenv ] && [[ "$DATABASE_URL" == *"mssql"* ]]; then
    echo "⚠️  Detected MS SQL URL in local host environment. Falling back to SQLite for local run."
    export DATABASE_URL="sqlite:///./books.db"
fi

source venv/bin/activate
exec uvicorn app.main:app --host 0.0.0.0 --port 5001 --reload

