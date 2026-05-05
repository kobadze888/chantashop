#!/bin/bash
# Server-side pull-and-deploy. Run on VPS as root.
set -e

PROJECT_DIR=/home/chantashop/htdocs/chantashop.ge
PM2_NAME=chantashop-front
DEPLOY_USER=chantashop

cd "$PROJECT_DIR"

echo "📥 [1/4] Pulling latest from origin/main..."
sudo -u "$DEPLOY_USER" git fetch origin main
LOCAL=$(sudo -u "$DEPLOY_USER" git rev-parse HEAD)
REMOTE=$(sudo -u "$DEPLOY_USER" git rev-parse origin/main)
if [ "$LOCAL" = "$REMOTE" ]; then
  echo "ℹ️  Already up to date with origin/main."
else
  sudo -u "$DEPLOY_USER" git reset --hard origin/main
fi

echo "📦 [2/4] Installing dependencies..."
su - "$DEPLOY_USER" -c "cd $PROJECT_DIR && npm install --no-audit --no-fund"

echo "🏗️  [3/4] Building..."
su - "$DEPLOY_USER" -c "cd $PROJECT_DIR && rm -rf .next && npm run build"

echo "🔄 [4/4] Restarting PM2 ($PM2_NAME) as $DEPLOY_USER..."
su - "$DEPLOY_USER" -c "pm2 restart $PM2_NAME --update-env && pm2 save"

echo "✅ Deploy complete."
su - "$DEPLOY_USER" -c "pm2 list" | grep "$PM2_NAME" || true
