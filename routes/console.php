<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Illuminate\Foundation\Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('db:backup')->weekly()->sundays()->at('00:00');
Schedule::command('db:backup --email')->monthlyOn(1, '01:00');
