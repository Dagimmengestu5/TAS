<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = ['job_requisition_id', 'is_internal', 'is_external', 'deadline', 'status', 'description', 'title', 'tags', 'category', 'location', 'employment_type', 'education_level', 'experience_level', 'core_requirements'];

    public function requisition()
    {
        return $this->belongsTo(JobRequisition::class, 'job_requisition_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Automatically closes job postings that have passed their deadline.
     */
    public static function closeStatusForExpiredJobs()
    {
        return self::where('status', 'posted')
            ->whereNotNull('deadline')
            ->where('deadline', '<', now())
            ->update(['status' => 'closed']);
    }
}
