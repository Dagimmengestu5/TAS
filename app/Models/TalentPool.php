<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TalentPool extends Model
{
    protected $table = 'talent_pool';
    protected $fillable = ['candidate_id', 'tags', 'skills'];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
