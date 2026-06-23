#!/bin/bash
set -e
echo "Pulling latest NeoVoid..."
cd "$(dirname "$0")/.."
git pull origin main
echo "Installing dependencies..."
npm install
echo "Compiling..."
npm run compile
echo "Packaging..."
npm run gulp vscode-linux-x64
echo "NeoVoid updated!"
