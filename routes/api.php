<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\SocialiteController;
use App\Http\Controllers\Api\OtpVerificationController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RequisitionController;
use App\Http\Controllers\Api\OrgController;
use App\Http\Controllers\Api\ApplicationMessageController;
use Illuminate\Support\Facades\Route;

// Connectivity tests
Route::get('/', function () {
    return response()->json(['message' => 'TAS API Connectivity: Success', 'status' => 'online']);
});

Route::get('/ping', function () {
    return response()->json(['message' => 'API Sub-route Ping: Success']);
});

// OAuth Routes (EXPLICIT)
Route::get('/auth/google/redirect', [SocialiteController::class, 'redirect'])->defaults('provider', 'google');
Route::get('/auth/github/redirect', [SocialiteController::class, 'redirect'])->defaults('provider', 'github');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->defaults('provider', 'google');
Route::get('/auth/github/callback', [SocialiteController::class, 'callback'])->defaults('provider', 'github');


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/email', [AuthController::class, 'forgotPassword']);
Route::post('/password/reset', [AuthController::class, 'resetPassword'])->name('password.reset');

// Email Verification (OTP Based)
Route::post('/email/send-otp', [OtpVerificationController::class, 'sendOtp'])
    ->middleware(['throttle:6,1']);
Route::post('/email/verify-otp', [OtpVerificationController::class, 'verifyOtp']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Job Management (Protected actions)
    Route::get('/jobs/all', [JobController::class, 'all']);
    Route::patch('/jobs/{job}/approve', [JobController::class, 'approve']);
    Route::patch('/jobs/{job}/reject', [JobController::class, 'reject']);
    Route::apiResource('jobs', JobController::class)->except(['index', 'show']);
    
    // Requisitions
    Route::get('/requisitions', [RequisitionController::class, 'index']);
    Route::post('/requisitions', [RequisitionController::class, 'store']);
    Route::post('/requisitions/{requisition}/update', [RequisitionController::class, 'update']);
    Route::delete('/requisitions/{requisition}', [RequisitionController::class, 'destroy']);
    
    // Approvals
    Route::get('/approvals/hr/requisitions', [\App\Http\Controllers\Api\ApprovalDashboardController::class, 'getHrRequisitions']);
    Route::get('/approvals/ceo/requisitions', [\App\Http\Controllers\Api\ApprovalDashboardController::class, 'getCeoRequisitions']);
    
    // Applications
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // User Management
    Route::apiResource('users', UserController::class);

    // Organization Structure
    Route::get('/companies', [OrgController::class, 'companies']);
    Route::get('/departments', [OrgController::class, 'departments']);

    // Reports
    Route::get('/reports/metrics', [ReportController::class, 'getRecruitmentMetrics']);
    Route::get('/reports/ta-report', [ReportController::class, 'getTAReport']);
});

// Public Job Access
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{job}', [JobController::class, 'show']);
