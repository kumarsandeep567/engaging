#!/bin/bash

# Wait for the database to be ready
echo "Waiting for the database connection..."
sleep 20

echo "Database is up and running"

# Force database migration (with seed)
php artisan migrate:fresh --seed --force

# Start the main process (e.g., Nginx)
exec "$@"
