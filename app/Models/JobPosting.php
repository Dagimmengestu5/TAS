<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = ['job_requisition_id', 'is_internal', 'is_external', 'deadline', 'status'];

    public function requisition()
    {
        return $this->belongsTo(JobRequisition::class, 'job_requisition_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
