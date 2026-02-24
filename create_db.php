<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1', 'root', 'Dagi@2546');
    $pdo->exec('CREATE DATABASE IF NOT EXISTS tas');
    echo "Database 'tas' created or already exists.\n";
} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
?>
