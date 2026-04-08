#!/bin/bash

# Script to update PayFlow to PayFlot in all files

echo "Updating PayFlow to PayFlot..."

# Update HTML file
sed -i 's/PayFlow/PayFlot/g' index.html
sed -i 's/payflow\.com/payflot.com/g' index.html

# Update CSS file (if any references)
sed -i 's/PayFlow/PayFlot/g' style.css

# Update JS file
sed -i 's/PayFlow/PayFlot/g' script.js

# Update README
sed -i 's/PayFlow/PayFlot/g' README.md

# Update package.json
sed -i 's/PayFlow/PayFlot/g' package.json
sed -i 's/payflow-landing/payflot-landing/g' package.json

# Update deploy script
sed -i 's/PayFlow/PayFlot/g' deploy.sh

echo "✅ All files updated from PayFlow to PayFlot"
echo ""
echo "Changes made:"
echo "- HTML: Title, logo, text, email"
echo "- CSS: Any references"
echo "- JS: Console logs and messages"
echo "- Documentation: README, package.json"
echo "- Deployment script"

echo ""
echo "Note: Domain payflot.com should be registered separately."