<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Notifications\GenericNotification;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::first(); // Send to the first user (usually admin)
        
        if ($admin) {
            $admin->notify(new GenericNotification(
                'New Application Received',
                'A new candidate has applied for the Senior Software Engineer position.'
            ));

            $admin->notify(new GenericNotification(
                'Interview Scheduled',
                'The interview for John Doe has been scheduled for tomorrow at 10 AM.'
            ));

            $admin->notify(new GenericNotification(
                'System Update',
                'The management OS has been updated to version 2.1.0.'
            ));
        }
    }
}
