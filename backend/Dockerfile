FROM python:3.10-slim

WORKDIR /backend

# Install system dependencies needed for compiling psycopg2 and connection checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . .

# Expose backend port
EXPOSE 8000

# Copy and make entrypoint script executable
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/backend/entrypoint.sh"]
