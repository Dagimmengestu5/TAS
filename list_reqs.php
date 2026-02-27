<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

echo "--- REQUISITIONS ---\n";
foreach(\App\Models\JobRequisition::all() as $r) {
    echo "ID: {$r->id} | Status: {$r->status} | Title: {$r->title}\n";
}
echo "--- END ---\n";
