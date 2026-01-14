<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Models\User; // Don't forget imports
use App\Http\Controllers\StrandController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\EnrollmentSettingController;
use App\Http\Controllers\CORController;
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
    // SECTIONS & MASTERLIST ROUTES
    Route::apiResource('sections', SectionController::class);
    Route::get('/sections/{id}/masterlist', [SectionController::class, 'masterList']);
    // ✅ 1. TICKET BOOTH: Dito hihingi ng Signed URL ang React
    Route::get('/sections/{id}/masterlist/generate-url', [SectionController::class, 'generatePrintUrl']);
    Route::apiResource('subjects', SubjectController::class);

    Route::apiResource('students', StudentController::class);
    // Custom Route para sa Status Change (Passed, Released, Reset, etc.)
    Route::put('/students/{id}/status', [StudentController::class, 'changeStatus']);
    Route::get('/students/{id}/cor-data', [CORController::class, 'getCORData']); // Populate Modal
    Route::post('/cor/generate-url', [CORController::class, 'generateUrl']); // ✅ NEW: Save data & Get URL

    Route::get('/settings', [EnrollmentSettingController::class, 'index']);
});

// SA LABAS ng auth:sanctum (Dito bubuksan ang PDF, protected by Signature)
Route::get('/print/cor/{id}', [CORController::class, 'printCOR'])
    ->name('cor.print')
    ->middleware('signed');
    
// ✅ 2. THE VIP GATE: Ito ang gagamitin ng browser para mag-download
// Nasa LABAS ng auth:sanctum, pero protektado ng 'signed' middleware (Laravel feature)
Route::get('/print/masterlist/{section}/{user}', [SectionController::class, 'printMasterList'])
    ->name('masterlist.print')
    ->middleware('signed');

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