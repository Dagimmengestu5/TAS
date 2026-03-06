<?php
use App\Models\User;
use App\Models\Application;
use App\Models\JobPosting;
use App\Models\Candidate;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "--- SESSION DATA (SIMULATED) ---\n";
$out = "";
$out .= "--- SESSION DATA (SIMULATED) ---\n";
$users = User::whereIn('id', [1, 3, 4, 5])->get();
foreach ($users as $u) {
    $out .= "User ID: {$u->id}, Name: {$u->name}, RoleID: {$u->role_id}, CompID: " . ($u->company_id ?? 'NULL') . "\n";
}

$out .= "\n--- RECENT APPLICATIONS (LATEST 20) ---\n";
$apps = Application::with(['candidate', 'jobPosting.requisition'])->latest()->take(20)->get();
foreach ($apps as $a) {
    $cand = $a->candidate;
    $job = $a->jobPosting;
    $req = $job ? $job->requisition : null;
    $compID = $req ? $req->company_id : 'N/A';
    $out .= "ID: {$a->id}, Status: {$a->status}, JobCompID: {$compID}, JobID: " . ($job->id ?? 'N/A') . ", Title: " . ($job->title ?? 'N/A') . ", Cand: " . ($cand->name ?? 'N/A') . ", Created: {$a->created_at}\n";
}

$out .= "\n--- RECENT CANDIDATES (LATEST 10) ---\n";
$cands = Candidate::latest()->take(10)->get();
foreach ($cands as $c) {
    $out .= "ID: {$c->id}, Name: {$c->name}, Email: {$c->email}, UserID: " . ($c->user_id ?? 'NULL') . ", Created: {$c->created_at}\n";
}

file_put_contents('debug_output.txt', $out);
echo "Output written to debug_output.txt\n";
