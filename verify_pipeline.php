<?php

use App\Models\Application;
use App\Models\JobPosting;
use App\Models\JobRequisition;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$applications = Application::with(['jobPosting.requisition', 'candidate'])->get();

echo "Total Applications: " . $applications->count() . "\n";

foreach ($applications as $a) {
    echo "App ID: {$a->id} | Status: {$a->status} | Cand: " . ($a->candidate ? $a->candidate->name : 'N/A') . " | Posting: " . ($a->jobPosting ? 'Yes' : 'No') . " | Requisition: " . ($a->jobPosting && $a->jobPosting->requisition ? $a->jobPosting->requisition->title : 'No') . "\n";
}
