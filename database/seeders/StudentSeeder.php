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
        $currentYear = Carbon::now()->year; 
        $schoolYear = $currentYear . '-' . ($currentYear + 1); // e.g., 2026-2027

        $createStudent = function ($status, $count) use ($faker, $currentYear, $schoolYear) {
            for ($i = 0; $i < $count; $i++) {
                $section = Section::inRandomOrder()->first();
                $randomDate = Carbon::createFromDate($currentYear, rand(1, 12), rand(1, 28));

                // Status logic for Released
                $releasedBy = null;
                $releasedAt = null;
                if ($status === 'released') {
                    $releasedBy = 'Administrator';
                    $releasedAt = $randomDate;
                }

                Student::create([
                    // ❌ REMOVED: reference_number
                    
                    'lrn' => $faker->unique()->numerify('10##########'),
                    'last_name' => $faker->lastName,
                    'first_name' => $faker->firstName,
                    'middle_name' => $faker->lastName,
                    'suffix' => $faker->randomElement(['', '', '', 'Jr.', 'III']),
                    
                    'date_of_birth' => $faker->date('Y-m-d', '2008-01-01'),
                    'age' => $faker->numberBetween(16, 19),
                    'gender' => $faker->randomElement(['Male', 'Female']),
                    'place_of_birth' => 'Antipolo City',
                    'citizenship' => 'Filipino',
                    'civil_status' => 'Single',
                    'religion' => 'Roman Catholic',
                    
                    'home_address' => $faker->address,
                    'provincial_address' => $faker->address,
                    'email' => $faker->unique()->safeEmail,
                    'contact_number' => $faker->mobileNumber,
                    
                    'current_school_attended' => $faker->company . ' High School',
                    'strand_id' => $section->strand_id,
                    'section_id' => $section->id,
                    'grade_level' => $section->grade_level,
                    'semester' => '1st Semester',
                    'school_year' => $schoolYear, // ✅ ADDED: Required field
                    
                    // Family (Optional faker data)
                    'father_name' => $faker->name('Male'),
                    'father_occupation' => $faker->jobTitle,
                    'father_contact' => $faker->mobileNumber,
                    'mother_name' => $faker->name('Female'),
                    'mother_occupation' => $faker->jobTitle,
                    'mother_contact' => $faker->mobileNumber,

                    'status' => $status,
                    'released_by' => $releasedBy,
                    'released_at' => $releasedAt,
                    
                    'created_at' => $randomDate,
                    'updated_at' => $randomDate,
                ]);
            }
        };

        // Create Students per Status
        $createStudent('graduate', 5);
        $createStudent('dropped', 3);
        $createStudent('released', 3);
        $createStudent('enrolled', 20);
        $createStudent('pending', 10);
    }
}