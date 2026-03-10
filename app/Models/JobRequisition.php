<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRequisition extends Model
{
    protected $fillable = ['title', 'description', 'department_id', 'company_id', 'budget_status', 'status', 'user_id', 'jd_path', 'category', 'location', 'employment_type', 'reject_comment'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobPosting()
    {
        return $this->hasOne(JobPosting::class);
    }
}
