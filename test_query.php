<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$companyId = 1;

$apps = \App\Models\Application::whereHas('jobPosting.requisition', function($q) use ($companyId) {
    $q->where('company_id', $companyId);
})->get();

echo "Found " . $apps->count() . " apps with jobPosting.requisition.company_id = " . $companyId . "\n";
foreach($apps as $a) {
    echo "App ID: " . $a->id . ", Status: " . $a->status . ", Job Posting ID: " . $a->job_posting_id . "\n";
}
