<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserCredentialsMail; // (Kailangan mo i-setup ang view nito later)
use App\Mail\UserUpdatedMail;     // (Kailangan mo i-setup ang view nito later)
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

class UserController extends Controller
{
    // GET ALL USERS
    public function index()
    {
        // Ibalik ang users sorted by newest
        return User::latest()->get();
    }

    // CREATE USER
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required',
            'status' => 'required|in:active,inactive',
            'contact_number' => 'required',
            'birthday' => 'required|date',
            'age' => 'required|integer',
            'gender' => 'required',
        ]);

        $userData = $validated;
        $userData['password'] = Hash::make($validated['password']);
        
        // ❌ TANGGALIN NATIN ITO: 'email_verified_at' => now() 
        // Para manatiling UNVERIFIED ang account.
        
        $user = User::create($userData);

        // ✅ SEND CREDENTIALS & VERIFICATION LINK
        try {
            // 1. Generate Signed Verification URL (Valid for 24 hours)
            // Tinuturo natin ito sa API route na gagawin natin sa Step 4
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify.api', // Route Name
                Carbon::now()->addHours(24),
                ['id' => $user->id, 'hash' => sha1($user->email)]
            );

            // 2. Send Email
            Mail::to($user->email)->send(new UserCredentialsMail($user, $validated['password'], $verificationUrl));

        } catch (\Exception $e) {
            // Log error (optional)
        }

        return response()->json(['message' => 'User created! Credentials sent via email.', 'user' => $user]);
    }

    // UPDATE USER
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required',
            'status' => 'required|in:active,inactive',
            'contact_number' => 'required',
            'birthday' => 'required|date',
            'age' => 'required|integer',
            'gender' => 'required',
        ]);

        // Variable para sa Plain Password
        $plainPassword = null;

        // 1. Password Logic
        if ($request->filled('password')) {
            $plainPassword = $request->password; // 👈 KOPYAHIN MUNA ANG PLAIN TEXT
            $validated['password'] = Hash::make($plainPassword); // Saka i-hash
        } else {
            unset($validated['password']);
        }

        // 2. Fill Data
        $user->fill($validated);

        // 3. Status Logic (Inactive = Null Verify)
        if ($request->status === 'inactive') {
            $user->email_verified_at = null;
        }

        // 4. GET CHANGES (Dito makukuha ang Hashed Password)
        $changes = $user->getDirty(); 

        // Clean up internal fields
        unset($changes['updated_at']);
        unset($changes['email_verified_at']); 

        // 🚨 OVERRIDE: Palitan ang Hashed Password ng Plain Password sa Email List
        if ($plainPassword && array_key_exists('password', $changes)) {
            $changes['password'] = $plainPassword; // 👈 Ito ang magpapakita ng "password123"
        }

        // 5. Save
        $user->save();

        // 6. Send Email
        if (!empty($changes)) {
            try {
                Mail::to($user->email)->send(new UserUpdatedMail($user, $changes));
            } catch (\Exception $e) {
                // Log error
            }
        }

        return response()->json(['message' => 'User updated successfully!', 'user' => $user]);
    }

    // DELETE USER
    public function destroy($id)
    {
        // 🔒 SAFETY LOCK: Check kung sariling account ang buburahin
        if (auth()->id() == $id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $user = User::find($id);
        
        if($user) {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
        }
        
        return response()->json(['message' => 'User not found'], 404);
    }
}