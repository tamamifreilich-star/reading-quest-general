#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_DIR="$SCRIPT_DIR/web"
DOCS_DIR="$SCRIPT_DIR/docs"

mkdir -p "$DOCS_DIR"

cp "$WEB_DIR/index.html" "$DOCS_DIR/index.html"
cp "$WEB_DIR/style.css" "$DOCS_DIR/style.css"
cp "$WEB_DIR/app.js" "$DOCS_DIR/app.js"

echo "Synced web/ -> docs/"
