<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use Illuminate\Support\Facades\Auth;

$user = User::find(8);
Auth::login($user);
$request = \Illuminate\Http\Request::create('/api/requisitions', 'GET');
$request->setUserResolver(fn() => $user);

$controller = app(\App\Http\Controllers\Api\RequisitionController::class);
$response = $controller->index($request);

echo "--- START RESPONSE ---\n";
echo $response->getContent();
echo "\n--- END RESPONSE ---\n";
