<?php
// artisan_clear.php
// Upload to your tas_core folder on cPanel and visit it ONCE to clear caches.
// DELETE this file immediately after use.

define('LARAVEL_START', microtime(true));

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<pre>";

$kernel->call('config:clear');
echo "Config cache cleared.\n";

$kernel->call('cache:clear');
echo "App cache cleared.\n";

$kernel->call('route:clear');
echo "Route cache cleared.\n";

echo "\n<strong>Done! Please delete this file from the server now.</strong>";
echo "</pre>";
