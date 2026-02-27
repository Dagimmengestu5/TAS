<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

$user = User::find(9);
if (!$user) {
    die("User 9 not found\n");
}

echo "Testing for User: {$user->email} (ID: {$user->id}, Role: {$user->role_id})\n";

Auth::login($user);
DB::enableQueryLog();

$query = \App\Models\JobRequisition::with(['user', 'company', 'department']);
$raw_count = $query->count();
$results = $query->latest()->get();

echo "Raw Count: {$raw_count}\n";
echo "Results Count: " . $results->count() . "\n";
echo "SQL: " . json_encode(DB::getQueryLog(), JSON_PRETTY_PRINT) . "\n";
