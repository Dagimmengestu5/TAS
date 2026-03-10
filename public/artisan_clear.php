<?php
// artisan_clear.php
// SAVE THIS AS: public/artisan_clear.php
// Visit: https://tas.netwebup.com/public/artisan_clear.php

define('LARAVEL_START', microtime(true));

// Correct paths for public/ folder
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<pre>";

$kernel->call('config:clear');
echo "Config cache cleared.\n";

$kernel->call('cache:clear');
echo "App cache cleared.\n";

$kernel->call('route:clear');
echo "Route cache cleared.\n";

$kernel->call('view:clear');
echo "View cache cleared.\n";

echo "\n<strong>Done! Your changes in .env are now live. Please delete this file from the server now.</strong>";
echo "</pre>";
