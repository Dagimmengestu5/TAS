<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    protected $fillable = ['application_id', 'type', 'scheduled_at', 'location', 'notes', 'status'];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
