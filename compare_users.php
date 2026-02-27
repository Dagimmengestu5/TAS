<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

function dumpUser($id) {
    $u = \App\Models\User::find($id);
    if (!$u) {
        echo "User ID {$id}: NOT FOUND\n";
        return;
    }
    echo "User ID {$id}: Email: {$u->email} | Role: {$u->role_id} | Name: {$u->name}\n";
}

echo "Diagnostic for User accounts:\n";
dumpUser(1);
dumpUser(9);

echo "\nChecking requisitions for BOTH users:\n";
foreach ([1, 9] as $id) {
    $u = \App\Models\User::find($id);
    if ($u) {
        \Illuminate\Support\Facades\Auth::login($u);
        $count = \App\Models\JobRequisition::count(); // Should be 7
        echo "User {$id} logged in. DB Count: {$count}\n";
    }
}
