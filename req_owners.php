<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

echo "--- REQUISITION OWNERS ---\n";
foreach(\App\Models\JobRequisition::all() as $r) {
    echo "Req ID: {$r->id} | Status: {$r->status} | Owner ID: {$r->user_id}\n";
}
echo "--- END ---\n";
