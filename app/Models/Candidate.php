<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $fillable = [
        'user_id', 'name', 'email', 'phone', 'gender', 'age',
        'professional_background', 'years_of_experience', 
        'cv_path', 'institution_name', 'cgpa', 'current_address'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
