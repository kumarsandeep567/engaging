<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
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

});

Route::middleware('auth')->group(function () {

    // Route to edit the user's profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    // Route to update the user's profile
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Route to delete the user's profile
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
