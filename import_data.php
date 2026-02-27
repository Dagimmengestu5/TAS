<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$jsonPath = 'database_dump.json';
if (!file_exists($jsonPath)) {
    die("JSON dump file not found.\n");
}

$data = json_decode(file_get_contents($jsonPath), true);

DB::transaction(function() use ($data) {
    Schema::disableForeignKeyConstraints();

    foreach ($data as $table => $rows) {
        if (empty($rows)) {
            echo "Skipping empty table: {$table}\n";
            continue;
        }

        echo "Importing " . count($rows) . " rows into {$table}...\n";
        
        // Clear existing data (if any) to prevent duplication during re-runs
        DB::table($table)->truncate();
        
        // Insert data in chunks to handle large datasets
        foreach (array_chunk($rows, 100) as $chunk) {
            DB::table($table)->insert($chunk);
        }
    }

    Schema::enableForeignKeyConstraints();
});

echo "Import completed successfully.\n";
