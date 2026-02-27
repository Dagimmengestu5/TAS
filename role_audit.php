<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

echo "User List:\n";
foreach(\App\Models\User::with('role')->get() as $u) {
    echo "Email: {$u->email} | Role: " . ($u->role->name ?? 'N/A') . " (ID: {$u->role_id})\n";
}
