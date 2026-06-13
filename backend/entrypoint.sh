#!/bin/sh

echo "Waiting for postgres..."

# Use python script to check postgres connectivity. This is robust, parses DATABASE_URL, and avoids external dependencies.
python -c "
import sys
import time
import psycopg2
from urllib.parse import urlparse
import os

db_url = os.environ.get('DATABASE_URL')
if not db_url:
    print('DATABASE_URL environment variable is missing!')
    sys.exit(1)

parsed = urlparse(db_url)
host = parsed.hostname
port = parsed.port or 5432

print(f'Checking connection to {host}:{port}...')
retries = 30
while retries > 0:
    try:
        conn = psycopg2.connect(
            dbname=parsed.path[1:],
            user=parsed.username,
            password=parsed.password,
            host=host,
            port=port,
            connect_timeout=2
        )
        conn.close()
        print('Postgres is up and running!')
        sys.exit(0)
    except psycopg2.OperationalError as e:
        print(f'Postgres is unavailable, waiting... ({retries} retries left)')
        retries -= 1
        time.sleep(2)

print('Postgres connection timeout!')
sys.exit(1)
"

if [ $? -eq 0 ]; then
    echo "Running database seeding..."
    python seed.py
    echo "Starting FastAPI server..."
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000
else
    echo "Failed to connect to database. Exiting."
    exit 1
fi
