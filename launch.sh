#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"

echo "Starting Moon Hopper on http://localhost:${PORT}"
python3 -m http.server "${PORT}"
