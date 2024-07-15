<?php

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Broadcast;

/**
 * Laravel Reverb (using Websockets)
 * Create a presence channel that allows authenticated 
 * users to join and know about other users in the 
 * channel. 
 */

Broadcast::channel('online', function ($user) {

    // Return the UserResource if the user exists
    return $user ? new UserResource($user) : null;
});