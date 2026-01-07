<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Open Access)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/email/resend', [AuthController::class, 'resendVerification']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Requires Login/Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // ✅ 1. Get Current User (Mahalaga ito para sa Sidebar Name/Profile)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // ✅ 2. Logout (Dito dapat ito sa loob)
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ 3. Admin Dashboard Analytics
    Route::get('/admin/analytics', [AdminController::class, 'getAnalytics']);

    // ... (Dito natin idadagdag ang CRUD routes sa Step 4) ...
});
