<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

$user = User::find(8);
if (!$user) {
    die("User 8 not found\n");
}

echo "Testing for User: {$user->email} (ID: {$user->id}, Role: {$user->role_id})\n";

Auth::login($user);
DB::enableQueryLog();

$request = \Illuminate\Http\Request::create('/api/requisitions', 'GET');
$request->setUserResolver(fn() => $user);

$controller = app(\App\Http\Controllers\Api\RequisitionController::class);
$response = $controller->index($request);

echo "Response Status: " . $response->status() . "\n";
echo "Response Content: " . $response->getContent() . "\n";
