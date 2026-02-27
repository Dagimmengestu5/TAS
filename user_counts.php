<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

echo "User Counts by Role:\n";
foreach(\App\Models\Role::withCount('users')->get() as $role) {
    echo "{$role->name} (ID: {$role->id}): {$role->users_count}\n";
}
