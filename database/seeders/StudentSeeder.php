<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Section;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('en_PH'); // Philippine Data (Names/Address)

        // Gumawa ng 50 Students
        for ($i = 0; $i < 50; $i++) {
            
            // Randomly pick a Section (para automatic match ang Strand at Grade Level)
            $section = Section::inRandomOrder()->first();
            $strand = $section->strand; 

            // Random Status logic
            $status = $faker->randomElement(['pending', 'enrolled', 'enrolled', 'enrolled']); // Mas madaming enrolled

            Student::create([
                'reference_number' => 'REF-' . $faker->unique()->numberBetween(10000, 99999),
                'lrn' => $faker->unique()->numerify('10##########'), // 12-digit LRN format
                
                // Personal Info
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
                
                // Contact
                'home_address' => $faker->address,
                'email' => $faker->unique()->safeEmail,
                'contact_number' => $faker->mobileNumber, // PH Mobile format

                // Academic (Linked to the random Section we picked)
                'strand_id' => $strand->id,
                'section_id' => $section->id,
                'grade_level' => $section->grade_level,
                'semester' => '1st',
                'current_school_attended' => 'Antipolo National High School',

                // Parents (Dummy data)
                'father_name' => $faker->name('male'),
                'father_contact' => $faker->mobileNumber,
                'mother_name' => $faker->name('female'),
                'mother_contact' => $faker->mobileNumber,
                'guardian_name' => $faker->name,
                'guardian_contact' => $faker->mobileNumber,

                'status' => $status,
            ]);
        }
    }
}