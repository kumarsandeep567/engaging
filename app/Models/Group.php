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
}
