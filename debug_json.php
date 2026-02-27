<?php

use App\Models\Application;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$applications = Application::with(['jobPosting.requisition', 'candidate', 'histories'])->get();

header('Content-Type: application/json');
echo json_encode($applications, JSON_PRETTY_PRINT);
