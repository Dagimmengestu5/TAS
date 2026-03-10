<?php
// error_log_viewer.php
// Visit: https://tas.netwebup.com/public/error_log_viewer.php

$logPath = __DIR__ . '/../storage/logs/laravel.log';

echo "<h2>Laravel Error Log (Last 10KB)</h2>";

if (!file_exists($logPath)) {
    die("Log file not found at: $logPath");
}

$size = filesize($logPath);
$start = max(0, $size - 10240); // Last 10KB

$fp = fopen($logPath, 'r');
fseek($fp, $start);
$content = fread($fp, 10240);
fclose($fp);

echo "<pre style='background:#222; color:#eee; padding:15px; border-radius:5px;'>";
echo htmlspecialchars($content);
echo "</pre>";
?>
