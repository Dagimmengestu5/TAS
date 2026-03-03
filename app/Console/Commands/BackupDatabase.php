<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup {--email : Whether to email the backup to the admin}';
    protected $description = 'Backup the database to a .sql file';

    public function handle()
    {
        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $host = env('DB_HOST');
        
        $filename = "backup-" . now()->format('Y-m-d_H-i-s') . ".sql";
        $path = storage_path("app/backups/" . $filename);
        
        if (!file_exists(storage_path('app/backups'))) {
            mkdir(storage_path('app/backups'), 0755, true);
        }

        // Path to mysqldump on this Windows machine
        $mysqldumpPath = '"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"';
        
        $command = sprintf(
            '%s --user=%s --password=%s --host=%s %s > %s',
            $mysqldumpPath,
            escapeshellarg($username),
            escapeshellarg($password),
            escapeshellarg($host),
            escapeshellarg($database),
            escapeshellarg($path)
        );

        $this->info("Starting backup of database {$database}...");
        
        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            $this->info("Backup successfully created at: {$path}");
            
            if ($this->option('email')) {
                $this->sendBackupEmail($path);
            }
        } else {
            $this->error("Backup failed with exit code {$returnVar}.");
            $this->error(implode("\n", $output));
        }
    }

    protected function sendBackupEmail($path)
    {
        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        if (!$adminRole) {
            $this->error("Admin role not found.");
            return;
        }

        $admin = \App\Models\User::where('role_id', $adminRole->id)->first();
        if (!$admin) {
            $this->error("Admin user not found.");
            return;
        }

        $this->info("Sending backup email to {$admin->email}...");
        
        try {
            \Illuminate\Support\Facades\Mail::to($admin->email)
                ->send(new \App\Mail\DatabaseBackupMail($path));
            $this->info("Backup email sent successfully.");
        } catch (\Exception $e) {
            $this->error("Failed to send email: " . $e->getMessage());
        }
    }
}
