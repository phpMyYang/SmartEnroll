<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Section;
use Faker\Factory as Faker;
use Carbon\Carbon;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('en_PH');
        
        // 👇 KUNIN ANG CURRENT YEAR (Para match lagi sa Dashboard default)
        $currentYear = Carbon::now()->year; 

        // Helper function
        $createStudent = function ($status, $count) use ($faker, $currentYear) {
            for ($i = 0; $i < $count; $i++) {
                $section = Section::inRandomOrder()->first();
                
                // 👇 Gamitin ang $currentYear dito
                $randomDate = Carbon::createFromDate($currentYear, rand(1, 12), rand(1, 28));

                Student::create([
                    'reference_number' => 'REF-' . $faker->unique()->numberBetween(10000, 99999),
                    'lrn' => $faker->unique()->numerify('10##########'),
                    'last_name' => $faker->lastName,
                    'first_name' => $faker->firstName,
                    'middle_name' => $faker->lastName,
                    'date_of_birth' => $faker->date('Y-m-d', '2008-01-01'),
                    'age' => $faker->numberBetween(16, 19),
                    'gender' => $faker->randomElement(['Male', 'Female']),
                    'place_of_birth' => 'Antipolo City',
                    'citizenship' => 'Filipino',
                    'civil_status' => 'Single',
                    'religion' => 'Roman Catholic',
                    'home_address' => $faker->address,
                    'email' => $faker->unique()->safeEmail,
                    'contact_number' => $faker->mobileNumber,
                    'strand_id' => $section->strand_id,
                    'section_id' => $section->id,
                    'grade_level' => $section->grade_level,
                    'semester' => '1st',
                    'status' => $status, 
                    'created_at' => $randomDate, // ✅ Dynamic date na
                    'updated_at' => $randomDate,
                ]);
            }
        };

        // 1. ADD REQUESTED DATA
        $createStudent('graduate', 10);
        $createStudent('dropped', 5);
        $createStudent('released', 5);

        // 2. ADD EXISTING RANDOM DATA
        $createStudent('enrolled', 30);
        $createStudent('pending', 10);
    }
}