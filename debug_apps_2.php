<?php
use App\Models\User;
use App\Models\Candidate;
use App\Models\Application;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = User::all();
echo "USERS:\n";
foreach ($users as $u) {
    echo "U{$u->id}: {$u->email} (Name: {$u->name})\n";
}

$candidates = Candidate::all();
echo "\nCANDIDATES:\n";
foreach ($candidates as $c) {
    echo "C{$c->id}: {$c->email} (UID: " . ($c->user_id ?? 'NULL') . ", Name: {$c->name})\n";
}

$applications = Application::all();
echo "\nAPPLICATIONS:\n";
foreach ($applications as $a) {
    echo "A{$a->id}: CandID {$a->candidate_id}, Status: {$a->status}\n";
}
