<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use App\Models\JobRequisition;

$roleNames = [3 => 'HR Approver', 6 => 'CEO Approver'];

foreach ($roleNames as $roleId => $name) {
    echo "\nSimulating for $name (Role ID: $roleId):\n";
    $user = User::where('role_id', $roleId)->first();
    if (!$user) {
        echo " - No user found with this role.\n";
        continue;
    }
    
    $query = JobRequisition::query();
    if ($user->role_id == 2) { 
        $query->where('user_id', $user->id);
    } elseif (in_array($user->role_id, [1, 3, 5, 6])) {
        // sees all
    } else {
        echo " - Access denied for this role ID.\n";
        continue;
    }
    
    $count = $query->count();
    $pendingHr = (clone $query)->where('status', 'pending_hr')->count();
    $pendingCeo = (clone $query)->where('status', 'pending_ceo')->count();
    
    echo " - Total visible: $count\n";
    echo " - Pending HR: $pendingHr\n";
    echo " - Pending CEO: $pendingCeo\n";
}
