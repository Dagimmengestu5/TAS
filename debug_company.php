<?php
use App\Models\User;
use App\Models\Application;
use App\Models\JobPosting;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "--- TA USERS ---\n";
$taUsers = User::whereHas('role', fn($q) => $q->where('name', 'ta_team'))->get();
foreach ($taUsers as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, CompanyID: " . ($u->company_id ?? 'NULL') . "\n";
}

echo "\n--- APPLICATIONS ---\n";
$apps = Application::with('jobPosting.requisition')->get();
foreach ($apps as $a) {
    $job = $a->jobPosting;
    $req = $job ? $job->requisition : null;
    $compID = $req ? $req->company_id : 'N/A';
    echo "ID: {$a->id}, Status: {$a->status}, JobCompID: {$compID}, CandID: {$a->candidate_id}\n";
}
