<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

echo "--- ALL USERS ---\n";
foreach(\App\Models\User::all() as $u) {
    echo "ID: {$u->id} | Email: {$u->email} | Role: {$u->role_id}\n";
}
echo "--- END ---\n";
