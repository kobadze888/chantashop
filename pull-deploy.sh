#!/bin/bash
# Server-side pull-and-deploy. Run on VPS as root: ssh chantashop '.../pull-deploy.sh'
set -e

PROJECT_DIR=/home/chantashop/htdocs/chantashop.ge
PM2_NAME=chantashop-front
DEPLOY_USER=chantashop

cd "$PROJECT_DIR"

echo "📥 [1/5] Pulling latest from origin/main..."
sudo -u "$DEPLOY_USER" git fetch origin main
sudo -u "$DEPLOY_USER" git reset --hard origin/main

echo "📦 [2/5] Installing dependencies..."
su - "$DEPLOY_USER" -c "cd $PROJECT_DIR && source ~/.nvm/nvm.sh && npm install --no-audit --no-fund"

# NOTE: we intentionally do NOT 'rm -rf .next'. Keeping .next/cache preserves the
# Next.js image-optimizer cache (.next/cache/images) and the fetch data cache
# across deploys, so photos/pages are not re-optimized cold after every deploy.
echo "🏗️  [3/5] Building (incremental, image cache preserved)..."
su - "$DEPLOY_USER" -c "cd $PROJECT_DIR && source ~/.nvm/nvm.sh && npm run build"

echo "🔄 [4/5] Restarting PM2 ($PM2_NAME)..."
su - "$DEPLOY_USER" -c "source ~/.nvm/nvm.sh && pm2 restart $PM2_NAME --update-env && pm2 save"

echo "🔥 [5/5] Warming pages + images in background..."
(bash "$PROJECT_DIR/warm-key.sh"    > /root/warmkey.log    2>&1 &)
(bash "$PROJECT_DIR/warm-images.sh" > /root/warmimages.log 2>&1 &)

echo "✅ Deploy complete."
su - "$DEPLOY_USER" -c "source ~/.nvm/nvm.sh && pm2 list" | grep "$PM2_NAME" || true
