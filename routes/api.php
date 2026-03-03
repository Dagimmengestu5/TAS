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
    
    // Requisitions (Creation and Basic Fetching)
    Route::get('/requisitions', [RequisitionController::class, 'index']);
    Route::post('/requisitions', [RequisitionController::class, 'store']);
    Route::post('/requisitions/{requisition}/update', [RequisitionController::class, 'update']);
    Route::delete('/requisitions/{requisition}', [RequisitionController::class, 'destroy']);
    
    // --- NEW DEDICATED APPROVAL DASHBOARD ENDPOINTS ---
    Route::get('/approvals/hr/requisitions', [\App\Http\Controllers\Api\ApprovalDashboardController::class, 'getHrRequisitions']);
    Route::patch('/approvals/hr/requisitions/{id}/approve', [\App\Http\Controllers\Api\ApprovalDashboardController::class, 'approveHrRequisition']);
    Route::patch('/approvals/hr/requisitions/{id}/reject', [\App\Http\Controllers\Api\ApprovalDashboardController::class, 'rejectHrRequisition']);

    Route::get('/approvals/ceo/requisitions', [\App\Http\Controllers\Api\ApprovalDashboardController::class, 'getCeoRequisitions']);
    Route::patch('/approvals/ceo/requisitions/{id}/approve', [\App\Http\Controllers\Api\ApprovalDashboardController::class, 'approveCeoRequisition']);
    Route::patch('/approvals/ceo/requisitions/{id}/reject', [\App\Http\Controllers\Api\ApprovalDashboardController::class, 'rejectCeoRequisition']);
    
    // Applications
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
    Route::post('/applications/{application}/offer-comment', [ApplicationController::class, 'submitOfferComment']);
    Route::get('/applications/{application}/messages', [ApplicationMessageController::class, 'index']);
    Route::post('/applications/{application}/messages', [ApplicationMessageController::class, 'store']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

    // Interviews
    Route::apiResource('interviews', InterviewController::class);

    // Offers
    Route::apiResource('offers', OfferController::class);

    // Onboarding
    Route::apiResource('onboarding', OnboardingController::class);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // User Management
    Route::get('/roles', [UserController::class, 'roles']);
    Route::apiResource('users', UserController::class);

    // Organization Structure
    Route::get('/companies', [OrgController::class, 'companies']);
    Route::post('/companies', [OrgController::class, 'storeCompany']);
    Route::put('/companies/{company}', [OrgController::class, 'updateCompany']);
    Route::delete('/companies/{company}', [OrgController::class, 'destroyCompany']);

    Route::get('/departments', [OrgController::class, 'departments']);
    Route::get('/companies/{companyId}/departments', [OrgController::class, 'departments']);
    Route::post('/departments', [OrgController::class, 'storeDepartment']);
    Route::put('/departments/{department}', [OrgController::class, 'updateDepartment']);
    Route::delete('/departments/{department}', [OrgController::class, 'destroyDepartment']);

    // Reports
    Route::get('/reports/metrics', [ReportController::class, 'getRecruitmentMetrics']);
    Route::get('/reports/ta-report', [ReportController::class, 'getTAReport']);
});

// Public Job Access (Placed after protected specific routes to avoid shadowing)
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{job}', [JobController::class, 'show']);

// OAuth Routes
Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback']);
