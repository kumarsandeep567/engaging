<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'message',
        'sender_id',
        'group_id',
        'receiver_id'
    ];

    /**
     * A message must have a sender.
     */
    public function sender() 
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * A message must have a receiver.
     * The receiver can either be another user or a group
     */
    public function receiver() 
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * A message can belong to a group
     */
    public function group() 
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * A message can have one or more attachments
     */
    public function attachments() 
    {
        return $this->hasMany(MessageAttachment::class);
    }

}
