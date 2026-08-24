#!/bin/bash
set -e
PHP_FILE=$(find /vercel -name "index.js" -path "*vercel-php*" 2>/dev/null | head -1)
if [ -n "$PHP_FILE" ]; then
  sed -i "s/handler: 'launcher.launcher'/handler: 'launcher.js'/g" "$PHP_FILE"
  echo "Patched vercel-php handler"
fi
composer install --no-dev --optimize-autoloader
npm install
npm run build
