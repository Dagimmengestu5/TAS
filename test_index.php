<?php
use App\Models\User;
use App\Models\Candidate;
use App\Models\Application;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ApplicationController;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$controller = new ApplicationController();

foreach (User::all() as $u) {
    echo "Testing for User {$u->id} ({$u->email}):\n";
    $request = new Request(['scope' => 'self']);
    $request->setUserResolver(fn() => $u);
    
    $response = $controller->index($request);
    $data = $response->getData();
    
    echo "  Response count: " . count($data) . "\n";
    if (count($data) > 0) {
        foreach ($data as $app) {
            echo "    App ID: {$app->id}, Status: {$app->status}\n";
        }
    }
    echo "\n";
}
