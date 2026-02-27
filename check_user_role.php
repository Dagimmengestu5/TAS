<?php

use App\Models\User;
use App\Models\Role;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = User::where('email', 'admin@netwebup.com')->first();

echo "User Check:\n";
if ($user) {
    echo "ID: " . $user->id . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Role ID: " . ($user->role_id ?? 'NULL') . "\n";
    echo "Role Name: " . ($user->role ? $user->role->name : 'N/A') . "\n";
} else {
    echo "Admin user not found.\n";
}

echo "\nRoles Table:\n";
foreach (Role::all() as $role) {
    echo "ID: {$role->id} | Name: {$role->name}\n";
}
