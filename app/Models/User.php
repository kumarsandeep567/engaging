<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'avatar',
        'email',
        'password',
        'email_verified_at',
        'is_admin'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * Defines the one-to-many relationship between users and groups.
     * One user can belong to many groups.
     */
    public function groups() 
    {
        return $this->belongsToMany(Group::class, 'group_users');
    }

    /**
     * 
     */
    public static function getUsersExceptUser(User $user_to_exclude)
    {
        return $user_to_exclude;

        // Get the ID of the user to exclude
        $user_id = $user_to_exclude->id;

        $query = User::select([
            'users.*',
            'messages.message as last_message',
            'messages.created_at as last_message_date'
        ])->where('users.id', '!=', $user_id)
        ->when(!$user_to_exclude->is_admin, function ($query) {
            $query->whereNull('users.blocked_at');
        })
        ->leftJoin('conversations', function ($join) use ($user_id) {
            $join->on('conversations.user_id1', '=', 'users.id')
            ->where('conversations.user_id2', '=', $user_id);
        });
    }
}