<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class SubjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $subjects = [];

        // Kunin ang existing Strand IDs
        $strandIds = DB::table('strands')->pluck('id')->toArray();

        $titles = [
            'Oral Communication', 'Komunikasyon at Pananaliksik', 'General Mathematics', 
            'Earth and Life Science', 'Physical Education', 'Empowerment Technologies',
            'Pre-Calculus', 'Basic Calculus', 'General Chemistry', 'General Physics',
            'Fundamentals of ABM', 'Business Math', 'Organization and Management',
            'Computer Programming', 'Animation', 'System Analysis', 'Creative Writing',
            'Philippine Politics', 'World Religions', 'Disaster Readiness'
        ];

        for ($i = 1; $i <= 50; $i++) {
            // Random Strand ID or Null (Core)
            $strandId = (!empty($strandIds) && rand(0, 100) > 30) 
                ? $strandIds[array_rand($strandIds)] 
                : null;
            
            // Generate Code
            $codePrefix = $strandId ? 'SPEC' : 'CORE'; 
            
            $subjects[] = [
                'id' => Str::uuid(),
                'code' => $codePrefix . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'description' => $faker->randomElement($titles) . ' ' . $faker->randomDigitNotNull(),
                // 'units' => 3, // Removed per migration
                'grade_level' => $faker->randomElement(['11', '12']),
                
                // FIX: "1st" at "2nd" na lang (Wala nang 'Semester' na word)
                'semester' => $faker->randomElement(['1st', '2nd']),
                
                'strand_id' => $strandId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('subjects')->insert($subjects);
    }
}