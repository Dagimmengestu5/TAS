<?php
use App\Models\User;
use App\Models\Candidate;
use App\Models\Application;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$out = "";
$out .= "USERS:\n";
foreach (User::all() as $u) {
    $out .= "U{$u->id}: {$u->email} (UID: {$u->id}, Name: {$u->name})\n";
}

$out .= "\nCANDIDATES:\n";
foreach (Candidate::all() as $c) {
    $out .= "C{$c->id}: {$c->email} (LinkedUID: " . ($c->user_id ?? 'NULL') . ", Name: {$c->name})\n";
}

$out .= "\nAPPLICATIONS:\n";
foreach (Application::all() as $a) {
    $out .= "A{$a->id}: CandID {$a->candidate_id}, Status: {$a->status}\n";
}

file_put_contents('debug_output.txt', $out);
echo "Output written to debug_output.txt\n";
