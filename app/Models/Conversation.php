<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
