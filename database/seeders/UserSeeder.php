<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. ADMIN ACCOUNT
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@smartenroll.com',
            'password' => Hash::make('password123'), // Default Password
            'role' => 'admin',
            'email_verified_at' => now(), // Para verified na agad
        ]);

        // 2. STAFF ACCOUNT
        User::create([
            'name' => 'Registrar Staff',
            'email' => 'staff@smartenroll.com',
            'password' => Hash::make('password123'), // Default Password
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);
    }
}