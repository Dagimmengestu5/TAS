<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

echo "=== ROLES ===\n";
foreach(\App\Models\Role::all() as $r) {
    echo "ID: {$r->id} | Name: {$r->name}\n";
}

echo "\n=== USERS ===\n";
foreach(\App\Models\User::with('role')->get() as $u) {
    echo "ID: {$u->id} | Name: {$u->name} | Role: " . ($u->role->name ?? 'N/A') . " (ID: {$u->role_id})\n";
}

echo "\n=== REQUISITIONS ===\n";
foreach(\App\Models\JobRequisition::all() as $req) {
    echo "ID: {$req->id} | Status: {$req->status} | Title: {$req->title}\n";
}

echo "\n=== JOB POSTINGS ===\n";
foreach(\App\Models\JobPosting::all() as $post) {
    echo "ID: {$post->id} | Status: {$post->status} | Title: {$post->title}\n";
}
