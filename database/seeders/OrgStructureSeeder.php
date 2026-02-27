<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrgStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pharma = \App\Models\Company::create(['name' => 'Droga Pharma']);
        $coffee = \App\Models\Company::create(['name' => 'Droga Coffee']);
        $logistics = \App\Models\Company::create(['name' => 'Droga Logistics']);

        // Pharma Departments
        $pharma->departments()->createMany([
            ['name' => 'IT & Software Development'],
            ['name' => 'Quality Control'],
            ['name' => 'Sales & Marketing'],
            ['name' => 'Human Resources'],
        ]);

        // Coffee Departments
        $coffee->departments()->createMany([
            ['name' => 'Supply Chain'],
            ['name' => 'Roastery Operations'],
            ['name' => 'Retail Sales'],
            ['name' => 'Quality Assurance'],
        ]);

        // Logistics Departments
        $logistics->departments()->createMany([
            ['name' => 'Fleet Management'],
            ['name' => 'Warehouse Operations'],
            ['name' => 'Distribution'],
        ]);
    }
}
