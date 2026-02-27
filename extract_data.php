<?php

$localConfig = [
    'host' => '127.0.0.1',
    'db'   => 'tas',
    'user' => 'root',
    'pass' => 'Dagi@2546',
];

try {
    $dsn = "mysql:host={$localConfig['host']};dbname={$localConfig['db']};charset=utf8mb4";
    $pdo = new PDO($dsn, $localConfig['user'], $localConfig['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $data = [];
    $tables = [
        'roles', 
        'users', 
        'job_requisitions', 
        'job_postings', 
        'candidates', 
        'applications', 
        'application_status_histories',
        'interviews',
        'offers',
        'talent_pool'
    ];

    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT * FROM {$table}");
        $data[$table] = $stmt->fetchAll();
        echo "Extracted " . count($data[$table]) . " rows from {$table}\n";
    }

    file_put_contents('database_dump.json', json_encode($data, JSON_PRETTY_PRINT));
    echo "Data exported to database_dump.json\n";

} catch (PDOException $e) {
    echo "Error connecting to local DB: " . $e->getMessage() . "\n";
}
