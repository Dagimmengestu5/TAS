<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\JobPosting;

$jobs = JobPosting::all();
echo "Total Job Postings: " . $jobs->count() . "\n";
foreach($jobs as $j) {
    echo "ID: {$j->id} | Title: {$j->title} | Req ID: {$j->job_requisition_id}\n";
}
