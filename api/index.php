<?php
// Vercel Serverless PHP compatibility
$_SERVER['DOCUMENT_ROOT'] = __DIR__ . '/../public';

// Create temp directories for Vercel's read-only filesystem
$tmp = '/tmp/laravel';
$dirs = [
    $tmp . '/framework/cache/data',
    $tmp . '/framework/sessions',
    $tmp . '/framework/testing',
    $tmp . '/framework/views',
    $tmp . '/logs',
    $tmp . '/bootstrap/cache',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}

// Override storage paths
$_ENV['VIEW_COMPILED_PATH'] = $tmp . '/framework/views';
$_ENV['APP_CONFIG_CACHE'] = $tmp . '/bootstrap/cache/config.php';
$_ENV['APP_EVENTS_CACHE'] = $tmp . '/bootstrap/cache/events.php';
$_ENV['APP_PACKAGES_CACHE'] = $tmp . '/bootstrap/cache/packages.php';
$_ENV['APP_ROUTES_CACHE'] = $tmp . '/bootstrap/cache/routes.php';
$_ENV['APP_SERVICES_CACHE'] = $tmp . '/bootstrap/cache/services.php';
$_SERVER['APP_STORAGE_PATH'] = $tmp;

// Require standard Laravel bootstrap
require __DIR__ . '/../public/index.php';
