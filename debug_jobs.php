<?php
use App\Models\JobPosting;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "--- JOB POSTINGS ---\n";
$jobs = JobPosting::with('requisition')->get();
foreach ($jobs as $j) {
    $req = $j->requisition;
    echo "ID: {$j->id}, Title: {$j->title}, CompID: " . ($req->company_id ?? 'N/A') . ", Status: {$j->status}\n";
}
