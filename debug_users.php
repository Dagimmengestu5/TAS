<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$users = User::all();
foreach($users as $u) {
    echo "ID: {$u->id} | Name: {$u->name} | Role: {$u->role_id}\n";
}
