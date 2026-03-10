<?php
// database_sync.php
// Place this file in your tas_core folder (or the same folder as TAS_production_import.sql)

$db_host = 'localhost';
$db_user = 'netwebjn_ate';
$db_pass = 'Droga@2026';
$db_name = 'netwebjn_TAS';
$sql_file = 'TAS_production_import.sql';

echo "<h2>Database Synchronization Protocol</h2>";

if (!file_exists($sql_file)) {
    die("<p style='color:red;'>ERROR: $sql_file not found in this directory.</p>");
}

// Connect to MySQL
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("<p style='color:red;'>Connection failed: " . $conn->connect_error . "</p>");
}

echo "<p style='color:green;'>Connection successful. Initializing import...</p>";

// Read SQL file
$sql = file_get_contents($sql_file);

// Multi-query import
if ($conn->multi_query($sql)) {
    do {
        // Store first result set
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->next_result());
    echo "<p style='color:green; font-weight:bold;'>SUCCESS: Database has been synchronized successfully.</p>";
    echo "<p>Please delete this file (database_sync.php) and the SQL file immediately for security.</p>";
} else {
    echo "<p style='color:red;'>ERROR during import: " . $conn->error . "</p>";
}

$conn->close();
?>
