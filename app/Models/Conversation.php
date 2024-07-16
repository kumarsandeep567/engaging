<?php

namespace App\Models;

use App\Models\User;
use App\Models\Group;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conversation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id'
    ];

    /**
     * A conversation must have a 'last_message_id' to
     * keep track of the last message that was sent in the
     * conversation.
     */
    public function lastMessage() 
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    /**
     * A conversation must have two users.
     * Define user1 for the conversation.
     */
    public function user1() 
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    /**
     * A conversation must have two users.
     * Define user2 for the conversation.
     */
    public function user2() 
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    /**
     * Return the list of conversations 
     * to display on the application sidebar
     * except the current user
     */
    public static function getConversationsForSidebar(User $user)
    {
        $users = User::getUsersExceptUser($user);
        $groups = Group::getGroupsForUser($user);

        // Convert the $user collection
        return $users->map(function (User $user) {
            return $user->toConversationArray();
        })->concat($groups->map(function (Group $group) {
            return $group->toConversationArray();
        }));
    }
}
