<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('migrate:custom --with-seed')
            ->runInBackground()
            ->withoutOverlapping()
            ->onOneServer()
            ->when(function () {

                // Initiate database migration only if the lock file is not present
                return !file_exists(storage_path('database/migrate_custom.lock'));
            })
            ->then(function () {

                // Migration was successful. 
                $this->info("Database migrated and lock file created. Goodbye!");
            });