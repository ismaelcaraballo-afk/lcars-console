#!/bin/bash

echo "🚀 Pushing LCARS Console to GitHub..."
echo ""

# Initialize git if needed
if [ ! -d .git ]; then
  echo "Initializing git..."
  git init
fi

# Add all files
echo "Adding files..."
git add -A

# Commit
echo "Committing..."
git commit -m "Initial commit: LCARS AI Console with Easter eggs and voice control" || echo "Nothing new to commit"

# Add remote (ignore if already exists)
echo "Setting up remote..."
git remote add origin https://github.com/ismaelcaraballo-afk/lcars-console.git 2>/dev/null || git remote set-url origin https://github.com/ismaelcaraballo-afk/lcars-console.git

# Push
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your code is now at: https://github.com/ismaelcaraballo-afk/lcars-console"
