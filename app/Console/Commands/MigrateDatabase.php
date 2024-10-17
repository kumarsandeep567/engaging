<?php

namespace App\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:custom {--with-seed}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'The application will attempt the migration only if the database is ready';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        // Before migration, check if the application can talk to the database
        $this->info('Checking if the database is ready...');

        if (!$this->isDatabaseReady()) {
            $this->error('Database is not ready. Migration aborted.');

            // Return non-zero to indicate failure
            return 1;  
        }

        $this->info('Database ready. Starting migration...');

        // Run the migrations (force if in production)
        $this->call('migrate', [
            '--force' => true,
        ]);

        // Optionally run the seeders (force if in production)
        if ($this->option('with-seed')) {
            $this->call('db:seed', [
                '--force' => true
            ]);
        }
        
        // Mark the migration as completed
        file_put_contents(storage_path('database/migrate_custom.lock'), 'Migration completed successfully.');

        $this->info('Database migration completed successfully.');

        return 0;
    }

    protected function isDatabaseReady()
    {
        try {
            DB::connection()->getPdo();

            $result = DB::select("SHOW DATABASES LIKE 'engaging_messaging'");
            return !empty($result);
        } catch (Exception $e) {
            return false;
        }
    }
}
