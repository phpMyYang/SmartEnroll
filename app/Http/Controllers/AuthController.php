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
    // ✅ LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        // Check Credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials. Please try again.'], 401);
        }

        // Check Verification
        if (!$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email is not verified.', 'needs_verification' => true], 403);
        }

        // Create Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful!',
            'user' => $user,
            'role' => $user->role,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    // ✅ LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    // ✅ SEND RESET LINK
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent!']);
        }

        return response()->json(['message' => 'Unable to send reset link.'], 400);
    }

    // ✅ RESET PASSWORD (UPDATED with Auto-Login Token)
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
                $user->forceFill([
                    'password' => Hash::make($password) 
                ])->setRememberToken(Str::random(60));
                
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            $user = User::where('email', $request->email)->first();
            
            // 👇 ITO ANG KULANG PARTNER: Gumawa ng Token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Password reset success', 
                'role' => $user->role,
                'verified' => $user->hasVerifiedEmail(),
                'token' => $token, // 👈 Ibalik ang token sa frontend
                'user' => $user    // 👈 Ibalik din ang user details
            ]);
        }

        return response()->json(['message' => 'Invalid token or email.'], 400);
    }

    // ✅ RESEND VERIFICATION
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