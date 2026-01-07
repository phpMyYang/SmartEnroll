<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // ✅ LOGIN (Updated with Verification Check)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        // 1. Check Credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials. Please try again.'
            ], 401); // 401 = Unauthorized
        }

        // 2. 🛑 CHECK EMAIL VERIFICATION (Ito ang bago)
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email is not verified.',
                'needs_verification' => true // Flag para alam ng React na kailangan mag-verify
            ], 403); // 403 = Forbidden
        }

        // 3. Generate Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful!',
            'user' => $user,
            'role' => $user->role,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    // ✅ RESEND VERIFICATION EMAIL (New Function)
    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Safe response para hindi malaman kung nag-eexist ang email
            return response()->json(['message' => 'Verification link sent.']);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email is already verified.']);
        }

        // Send the notification
        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent to your email!']);
    }

    // ✅ LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    // ✅ FORGOT PASSWORD
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent!']);
        }

        return response()->json(['message' => 'Unable to send reset link.'], 400);
    }

    // ✅ RESET PASSWORD (UPDATED for Auto-Hash)
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                // 👇 ITO ANG PINAGBAGO: Tinanggal ko ang Hash::make
                // Dahil naka 'hashed' cast ka na sa User.php, automatic na yun.
                $user->forceFill([
                    'password' => $password 
                ])->setRememberToken(Str::random(60));
                
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            $user = User::where('email', $request->email)->first();
            
            // 👇 UPDATE: Idagdag ang 'verified' status sa response
            return response()->json([
                'message' => 'Password reset success', 
                'role' => $user->role,
                'verified' => $user->hasVerifiedEmail() // True kung verified, False kung hindi
            ]);
        }

        return response()->json(['message' => 'Invalid token or email.'], 400);
    }
}