<?php

use Illuminate\Support\Facades\Broadcast;

/**
 * To allow users to use Websockets (via Laravel reverb),
 * create a presence channel to allow users to join and  
 * know about other currently joined users in the channel.
 * Only allow authenticated users to join the channel.
 */
Broadcast::channel('online', function ($user) {
    return $user;
});