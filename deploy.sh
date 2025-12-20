#!/bin/bash

# 1. ფაილების მომზადება Git-ისთვის
echo "🚀 Adding changes to Git..."
git add .

# 2. ავტომატური კომიტის მესიჯი თარიღით
# მაგალითად: "Auto-deploy: 2025-12-20 18:15"
DEPLOY_DATE=$(date "+%Y-%m-%d %H:%M")
echo "📝 Committing changes with message: Auto-deploy: $DEPLOY_DATE"
git commit -m "Auto-deploy: $DEPLOY_DATE"

# 3. Push GitHub-ზე
echo "📤 Pushing to GitHub..."
git push origin main

# 4. პროექტის აწყობა (Build)
echo "🏗️ Starting Next.js Build..."
rm -rf .next
npm run build

# 5. საიტის გადატვირთვა
echo "🔄 Restarting PM2 process..."
pm2 restart 0

echo "✅ Done! Changes are live and pushed to GitHub at $DEPLOY_DATE."
