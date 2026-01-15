<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

class VerificationController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        $user = User::find($id);

        if (!$user) {
            return redirect('/login?status=error');
        }

        // Check kung tugma ang hash (Security Check)
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect('/login?status=invalid');
        }

        // Kung verified na dati pa
        if ($user->hasVerifiedEmail()) {
            return redirect('/login?status=already_verified');
        }

        // I-verify na ang user
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // REDIRECT sa Login Page na may dalang "verified" status
        return redirect('/login?status=verified');
    }
}