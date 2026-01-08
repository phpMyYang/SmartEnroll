<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Models\User; // Don't forget imports
use App\Http\Controllers\StrandController;
use App\Http\Controllers\SectionController;
use Illuminate\Auth\Events\Verified;

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
    Route::resource('users', UserController::class);
    Route::apiResource('strands', StrandController::class);
    Route::apiResource('sections', SectionController::class);
});

// ✅ EMAIL VERIFICATION ROUTE (Updated Logic)
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id) {
    $user = User::find($id);

    if (!$user) {
        return redirect(env('FRONTEND_URL', 'http://127.0.0.1:8000') . '/login?status=invalid');
    }

    if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
        return redirect(env('FRONTEND_URL', 'http://127.0.0.1:8000') . '/login?status=invalid');
    }

    // Kung verified na dati pa, redirect na lang
    if ($user->hasVerifiedEmail()) {
        return redirect(env('FRONTEND_URL', 'http://127.0.0.1:8000') . '/login?status=already_verified');
    }

    // 👇 DITO ANG PAGBABAGO: Pagka-verify, gawing ACTIVE ang status
    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
        
        // ✅ FORCE ACTIVATE ACCOUNT
        $user->forceFill([
            'status' => 'active'
        ])->save();
    }

    return redirect(env('FRONTEND_URL', 'http://127.0.0.1:8000') . '/login?status=verified');

})->name('verification.verify.api');