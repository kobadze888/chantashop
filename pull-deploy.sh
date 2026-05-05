#!/bin/bash
# Server-side pull-and-deploy. Run on VPS.
set -e

PROJECT_DIR=/home/chantashop/htdocs/chantashop.ge
PM2_NAME=chantashop-front

cd "$PROJECT_DIR"

# Make pm2/node available regardless of how this script is invoked.
export PATH=/root/.nvm/versions/node/v22.21.1/bin:$PATH

echo "📥 [1/4] Pulling latest from origin/main..."
git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" = "$REMOTE" ]; then
  echo "ℹ️  Already up to date with origin/main."
else
  git reset --hard origin/main
fi

echo "📦 [2/4] Installing dependencies..."
npm install --no-audit --no-fund

echo "🏗️  [3/4] Building..."
rm -rf .next
npm run build

echo "🔄 [4/4] Restarting PM2 ($PM2_NAME)..."
pm2 restart "$PM2_NAME" --update-env

echo "✅ Deploy complete."
pm2 list | grep "$PM2_NAME" || true
