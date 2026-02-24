<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/email', [AuthController::class, 'forgotPassword']);
Route::post('/password/reset', [AuthController::class, 'resetPassword'])->name('password.reset');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Job Management
    Route::apiResource('jobs', JobController::class);
    
    // Applications
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

    // Interviews
    Route::apiResource('interviews', InterviewController::class);

    // Offers
    Route::apiResource('offers', OfferController::class);

    // Onboarding
    Route::apiResource('onboarding', OnboardingController::class);

    // Reports
    Route::get('/reports/metrics', [ReportController::class, 'getRecruitmentMetrics']);
});
