<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRequisition extends Model
{
    protected $fillable = ['title', 'description', 'department', 'budget_status', 'status', 'user_id', 'jd_path', 'category', 'location', 'employment_type'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobPosting()
    {
        return $this->hasOne(JobPosting::class);
    }
}
