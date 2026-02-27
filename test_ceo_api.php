<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use Illuminate\Support\Facades\Auth;

$user = User::where('email', 'surafeltefera1978@gmail.com')->first();
if (!$user) {
    die("User not found\n");
}

Auth::login($user);
$request = \Illuminate\Http\Request::create('/api/requisitions', 'GET');
$request->setUserResolver(fn() => $user);

$controller = app(\App\Http\Controllers\Api\RequisitionController::class);
$response = $controller->index($request);

echo "Response Status: " . $response->status() . "\n";
echo "Response Data Count: " . count((array)$response->getData()) . "\n";
echo "Response Data: " . json_encode($response->getData(), JSON_PRETTY_PRINT) . "\n";
