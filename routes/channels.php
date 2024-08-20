<?php

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Broadcast;

/**
 * Laravel Reverb (using Websockets)
 */


/**
 * Create a presence channel that allows authenticated 
 * users to join and know about other users in the 
 * channel. 
 */
Broadcast::channel('online', function (User $user) {

    // Return the UserResource if the user exists
    return $user ? new UserResource($user) : null;
});


/**
 * Create a channel for every personal 1:1 chats.
 */
Broadcast::channel('message.user.{userId1}-{userId2}', function (
    User $user, int $userId1, int $userId2
) {
    
    // Every personal 1:1 chat will have their own communication channel
    return ($user->id === $userId1 || $user->id === $userId2)
    ? $user
    : null;
});


/**
 * Create a channel for every group chat.
 * Ensure the user is a member of the group.
 */
Broadcast::channel('message.group.{groupId}', function (User $user, int $groupId) {
    return ($user->groups->contains('id', $groupId))
    ? $user
    : null;
});


/**
 * Create a channel for broadcasting group deleted events.
 * Ensure the user is a member of the group.
 */
Broadcast::channel('group.deleted.{groupId}', function (User $user, int $groupId) {
    return ($user->groups->contains('id', $groupId));
});