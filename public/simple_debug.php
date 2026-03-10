<?php
// simple_debug.php
// SAVE THIS AS: public/simple_debug.php
// Visit: https://tas.netwebup.com/public/simple_debug.php

echo "<h2>Raw Environment Check (TAS Hub)</h2>";

$envPath = __DIR__ . '/../.env';

if (!file_exists($envPath)) {
    die("<p style='color:red'>.env file NOT FOUND at: $envPath. Please rename your .env.production to .env on the server.</p>");
}

echo "<p style='color:green'>.env file found! Reading values...</p>";

$content = file_get_contents($envPath);
$lines = explode("\n", $content);

echo "<pre style='background: #333; color: #fff; padding: 20px; border-radius: 8px;'>";
foreach ($lines as $line) {
    if (trim($line) === "" || strpos(trim($line), '#') === 0) continue;
    
    // Only show the keys we care about for security
    $keysToWatch = ['APP_URL', 'FRONTEND_URL', 'GOOGLE_REDIRECT_URI', 'GITHUB_REDIRECT_URI'];
    foreach ($keysToWatch as $key) {
        if (strpos($line, $key) !== false) {
            echo htmlspecialchars($line) . "\n";
        }
    }
}
echo "</pre>";

echo "<p><strong>Note:</strong> If the links above still say 'localhost', Google will reject the login.</p>";
?>
