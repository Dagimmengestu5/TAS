<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = ['application_id', 'salary', 'start_date', 'status', 'offer_letter_path'];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
