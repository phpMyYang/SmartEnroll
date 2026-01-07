<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Strand;

class StrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $strands = [
            ['code' => 'STEM', 'description' => 'Science, Technology, Engineering, and Mathematics'],
            ['code' => 'ABM',  'description' => 'Accountancy, Business, and Management'],
            ['code' => 'HUMSS','description' => 'Humanities and Social Sciences'],
            ['code' => 'GAS',  'description' => 'General Academic Strand'],
            ['code' => 'ICT',  'description' => 'Information and Communications Technology'],
        ];

        foreach ($strands as $strand) {
            Strand::create($strand);
        }
    }
}