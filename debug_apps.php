<?php
use App\Models\User;
use App\Models\Candidate;
use App\Models\Application;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = User::with('role')->get();
echo "--- USERS ---\n";
foreach ($users as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Email: {$u->email}, Role: " . ($u->role->name ?? 'N/A') . "\n";
}

$candidates = Candidate::all();
echo "\n--- CANDIDATES ---\n";
foreach ($candidates as $c) {
    echo "ID: {$c->id}, UserID: " . ($c->user_id ?? 'NULL') . ", Email: {$c->email}, Name: {$c->name}\n";
}

$applications = Application::all();
echo "\n--- APPLICATIONS ---\n";
foreach ($applications as $a) {
    echo "ID: {$a->id}, CandidateID: {$a->candidate_id}, Status: {$a->status}\n";
}
