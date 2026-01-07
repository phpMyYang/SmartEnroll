<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;

// 👇 Route para sa Email Verification Link
Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware(['signed']) // Importante: Security para hindi mapeke ang link
    ->name('verification.verify'); // Ito ang pangalang hinahanap ni Laravel

// ✅ Ito ang "pangalan" na hinahanap ng email generator
Route::get('/password-reset/{token}', function () {
    return view('welcome'); // Ibabalik nito ang React App
})->name('password.reset');

// I-load ang React App para sa lahat ng routes na hindi API
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');