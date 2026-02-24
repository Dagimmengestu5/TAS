<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnboardingPlan extends Model
{
    protected $fillable = ['user_id', 'checklist', 'orientation_date', 'status'];

    protected $casts = [
        'checklist' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
