<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    $path = public_path('index.html');
    if (!file_exists($path)) {
        return response("Frontend build (index.html) is missing in the public/ folder. Please run 'npm run build' in the frontend directory and copy the contents of 'dist' to 'public'.", 404);
    }
    return file_get_contents($path);
})->where('any', '.*');
