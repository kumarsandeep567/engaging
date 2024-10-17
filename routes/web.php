<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;

/**
 * Allow verified users to access the dashboard
 */
Route::middleware(['auth', 'verified'])->group(function () {

    // Route for the dashboard (a.k.a the homepage)
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');

    // Route for fetching the messages of the selected user
    Route::get('/user/{user}', [MessageController::class, 'byUser'])->name('chat.user');

    // Route for fetching the messages of the selected group
    Route::get('/group/{group}', [MessageController::class, 'byGroup'])->name('chat.group');

    // Route for creating and storing messages (personal and group)
    Route::post('/message', [MessageController::class, 'store'])->name('message.store');

    // Route for deleting messages (personal and group)
    Route::delete('/message/{message}', [MessageController::class, 'destroy'])->name('message.destroy');

    // Route to load older messages (personal and group)
    Route::get('/message/older/{message}', [MessageController::class, 'loadOlderMessages'])->name('message.loadOlder');

    // Route to create a new group
    Route::post('/group', [GroupController::class, 'store'])->name('group.store');

    // Route to update an existing group
    Route::put('/group/{group}', [GroupController::class, 'update'])->name('group.update');

    // Route to delete a group
    Route::delete('/group/{group}', [GroupController::class, 'destroy'])->name('group.destroy');

    
    // Routes for performing administrator operations (with middleware)
    Route::middleware(['admin'])->group(function () {

        // Route to add a new user
        Route::post('/user', [UserController::class, 'store'])->name('user.store');

        // Route to make/remove from Administrator
        Route::post('/user/change-role/{user}', [UserController::class, 'changeRole'])->name('user.changeRole');

        // Route to block a user
        Route::post('/user/block-unblock/{user}', [UserController::class, 'blockUnblock'])->name('user.blockUnblock');
    });
});

Route::middleware('auth')->group(function () {

    // Route to edit the user's profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    // Route to update the user's profile
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Route to delete the user's profile
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// Web route to force a database migration
Route::get('/migrate', function () {
    try {

        // Invoke the artisan migration command
        Artisan::call('migrate:custom');

        return response()->json([
            'message' => 'Migration successful!'
        ], 200);

    } catch (Exception $e) {
        
        return response()->json([
            'message' => 'Migration failed: '
        ], 500);
    }
});

require __DIR__.'/auth.php';
