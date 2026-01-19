<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // --- LOGIN ---
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        // 1. Check Credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials. Please try again.'], 401);
        }

        // 2. Check Verification
        if (!$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email is not verified.', 'needs_verification' => true], 403);
        }

        // 3. Check Role (Admin & Staff lang ang allowed)
        if (!in_array($user->role, ['admin', 'staff'])) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // 4. Create Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Log Activity
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'description' => "User {$user->name} ({$user->role}) logged in.",
            'ip_address' => $request->ip()
        ]);

        // 6. Return Response (Importante ang ROLE dito)
        return response()->json([
            'message' => 'Login successful!',
            'user' => $user,
            'role' => $user->role, // Ito ang gagamitin ng Frontend pang-redirect
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    // --- LOGOUT ---
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'logout',
                'description' => "User {$user->name} logged out.",
                'ip_address' => $request->ip()
            ]);
            $user->currentAccessToken()->delete();
        }
        return response()->json(['message' => 'Logged out successfully']);
    }

    // --- FORGOT PASSWORD (Send Link) ---
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent!']);
        }
        return response()->json(['message' => 'Unable to send reset link.'], 400);
    }

    // --- RESET PASSWORD (With Auto-Login) ---
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // 1. Reset Password Logic
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password) 
                ])->setRememberToken(Str::random(60));
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            $user = User::where('email', $request->email)->first();
            
            // 2. AUTO LOGIN: Create Token agad
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Password reset success', 
                'role' => $user->role, // Importante para sa redirect
                'verified' => $user->hasVerifiedEmail(),
                'token' => $token,     // Importante para sa auto-login
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Invalid token or email.'], 400);
    }

    // --- RESEND VERIFICATION ---
    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) return response()->json(['message' => 'Verification link sent.']);
        if ($user->hasVerifiedEmail()) return response()->json(['message' => 'Email is already verified.']);

        $user->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification link sent to your email!']);
    }
}