<?php
// route_debug.php
// Visit: https://tas.netwebup.com/public/route_debug.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

define('LARAVEL_START', microtime(true));

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<h2>Laravel Route List (API ONLY)</h2>";
echo "<pre style='background: #333; color: #fff; padding: 20px; border-radius: 8px;'>";

// Use the kernel to call the route:list command directly
$kernel->call('route:list', ['--path' => 'api']);
echo $kernel->output();

echo "</pre>";

echo "<h3>Environment Check (Direct from config)</h3>";
echo "APP_URL: " . config('app.url') . "<br>";
echo "FRONTEND_URL: " . config('app.frontend_url') . "<br>";
echo "GOOGLE_REDIRECT: " . config('services.google.redirect') . "<br>";
?>
