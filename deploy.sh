#!/bin/bash
# Local-side deploy script (run from your dev machine).
# Requires a meaningful commit message as the first argument.
set -e

if [ -z "$1" ]; then
  echo "❌ Commit message is required."
  echo "Usage: ./deploy.sh \"fix: footer translations\""
  exit 1
fi

MSG="$1"

echo "📦 Staging changes..."
git add .

if git diff --cached --quiet; then
  echo "ℹ️  Nothing to commit. Skipping commit & push."
else
  echo "📝 Committing: $MSG"
  git commit -m "$MSG"
  echo "📤 Pushing to GitHub..."
  git push origin main
fi

echo ""
echo "✅ Local deploy step done. Now run on the server:"
echo "   ssh chantashop '/home/chantashop/htdocs/chantashop.ge/pull-deploy.sh'"
