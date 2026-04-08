#!/bin/bash

# PayFlow Landing Page Deployment Script
# Deploys to various hosting platforms

set -e

echo "🚀 PayFlow Landing Page Deployment"
echo "=================================="

# Check if we have the necessary files
if [ ! -f "index.html" ] || [ ! -f "style.css" ] || [ ! -f "script.js" ]; then
    echo "❌ Error: Required files not found!"
    echo "Make sure you're in the payflow-landing directory"
    exit 1
fi

# Display deployment options
echo ""
echo "Select deployment method:"
echo "1. Vercel (Recommended)"
echo "2. Netlify"
echo "3. GitHub Pages"
echo "4. Surge.sh"
echo "5. Local preview"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "📦 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "📦 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    3)
        echo "📦 Deploying to GitHub Pages..."
        echo "Note: You need to have a GitHub repository set up"
        echo ""
        read -p "GitHub username: " github_user
        read -p "Repository name: " repo_name
        
        # Create .nojekyll file for GitHub Pages
        touch .nojekyll
        
        # Initialize git if not already
        if [ ! -d ".git" ]; then
            git init
            git add .
            git commit -m "Initial commit: PayFlow landing page"
        fi
        
        # Add remote and push
        git remote add origin "https://github.com/$github_user/$repo_name.git"
        git branch -M main
        git push -u origin main
        
        echo ""
        echo "✅ Pushed to GitHub. Now enable GitHub Pages in repository settings."
        echo "Your site will be available at: https://$github_user.github.io/$repo_name/"
        ;;
    4)
        echo "📦 Deploying to Surge.sh..."
        if ! command -v surge &> /dev/null; then
            echo "Installing Surge..."
            npm install -g surge
        fi
        
        # Generate a random subdomain
        random_name="payflow-$(date +%s)"
        surge . "$random_name.surge.sh"
        
        echo ""
        echo "✅ Deployed to: https://$random_name.surge.sh"
        ;;
    5)
        echo "🌐 Starting local preview server..."
        echo "Open http://localhost:8080 in your browser"
        echo "Press Ctrl+C to stop"
        
        # Check for Python 3
        if command -v python3 &> /dev/null; then
            python3 -m http.server 8080
        elif command -v python &> /dev/null; then
            python -m SimpleHTTPServer 8080
        else
            echo "❌ Python not found. Opening file directly..."
            open index.html || xdg-open index.html
        fi
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Deployment complete!"