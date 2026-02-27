<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\JobRequisition;

$reqs = JobRequisition::all();
echo "Total Requisitions: " . $reqs->count() . "\n";
foreach($reqs as $r) {
    echo "ID: {$r->id} | Title: {$r->title} | Status: {$r->status}\n";
}
