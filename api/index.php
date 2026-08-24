<?php
// Vercel Serverless PHP compatibility
$_SERVER['DOCUMENT_ROOT'] = __DIR__ . '/../public';

// Override storage paths to /tmp since Vercel is read-only
$_ENV['VIEW_COMPILED_PATH'] = '/tmp';
$_ENV['APP_CONFIG_CACHE'] = '/tmp/config.php';
$_ENV['APP_EVENTS_CACHE'] = '/tmp/events.php';
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/packages.php';
$_ENV['APP_ROUTES_CACHE'] = '/tmp/routes.php';
$_ENV['APP_SERVICES_CACHE'] = '/tmp/services.php';

// Require standard Laravel bootstrap
require __DIR__ . '/../public/index.php';
