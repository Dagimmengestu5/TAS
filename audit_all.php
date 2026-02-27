<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use App\Models\JobRequisition;
use App\Models\JobPosting;
use App\Models\Role;

echo "ROLES:\n";
foreach(Role::all() as $r) {
    echo "ID: {$r->id}, Name: {$r->name}\n";
}

echo "\nUSERS:\n";
foreach(User::all() as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Role ID: {$u->role_id}\n";
}

echo "\nREQUISITIONS:\n";
foreach(JobRequisition::all() as $r) {
    echo "ID: {$r->id}, Status: {$r->status}\n";
}

echo "\nPOSTINGS:\n";
foreach(JobPosting::all() as $p) {
    echo "ID: {$p->id}, Status: {$p->status}\n";
}
