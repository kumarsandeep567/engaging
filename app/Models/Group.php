<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id'
    ];

    /**
     * Defines the one-to-many relationship between groups and users.
     * One group can have many users.
     */
    public function users() 
    {
        return $this->belongsToMany(User::class, 'group_users');
    }

    /**
     * Defines the one-to-many relationship between groups and messages.
     * One group can have many messages.
     */
    public function messages() 
    {
        return $this->hasMany(Message::class);
    }
    
    /**
     * Defines the ownership of the group
     * One group can have only one owner
     */
    public function owner() 
    {
        return $this->belongsTo(User::class);
    } 
    
    /**
     * Get the list of groups (with their last messages) 
     * that have where the user is a member
     */
    public static function getGroupsForUser(User $user)
    {
        $query = self::select([
            'groups.*',
            'messages.message as last_message',
            'messages.created_at as last_message_date'
        ])
        ->join('group_users', 'group_users.group_id', '=', 'groups.id')
        ->leftJoin('messages', 'messages.id', '=', 'groups.last_message_id')
        ->where('group_users.user_id', $user->id)
        ->orderBy('messages.created_at', 'desc')
        ->orderBy('groups.name');

        return $query->get();
    }

    /**
     * Convert the group details collection to an array
     */
    public function toConversationArray() 
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'description'       => $this->description,
            'is_group'          => true,
            'is_user'           => false,
            'owner_id'          => $this->owner_id,
            'users'             => $this->users,
            'user_ids'          => $this->users->pluck('id'),
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
            'last_message'      => $this->last_message,
            'last_message_date' => $this->last_message_date ? $this->last_message_date.' UTC' : null
        ];
    }

    /**
     * Find the group with the given groupId, and update the group conversation
     * with the recently sent message. If the group does not exist, then
     * create one.
     */
    public static function updateGroupWithMessage($groupId, $message)
    {
        return self::updateOrCreate(
            ['id'               => $groupId],
            ['last_message_id'  => $message->id]
        );
    }
}
