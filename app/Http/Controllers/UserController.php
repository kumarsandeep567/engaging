<?php

namespace App\Http\Controllers;

use App\Mail\InviteUsers;
use App\Mail\UserBlockedUnblocked;
use App\Mail\UserRoleUpdated;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => ['required', 'string'],
            'email'     => ['required', 'email', 'unique:users,email'],
            'is_admin'  => ['boolean']
        ]);

        // Generate a random password of 12 characters
        $defaultPassword = Str::random(12);
        $data['password'] = bcrypt($defaultPassword);

        // Mark the email of the user as verified
        $data['email_verified_at'] = now();

        $user = User::create($data);

        Mail::to($user)->send(new InviteUsers($user, $defaultPassword));

        return redirect()->back();
    }

    public function changeRole(User $user)
    {
        $user->update([
            'is_admin' => !(bool) $user->is_admin
        ]);

        $message = $user->is_admin
        ? $user->name . " is now an administrator"
        : $user->name . " dismissed as administrator";

        Mail::to($user)->send(new UserRoleUpdated($user));

        return response()->json([
            'message' => $message
        ]);
    }

    public function blockUnblock(User $user)
    {
        if ($user->blocked_at) {
            $user->blocked_at = null;
            $message = $user->name . " has been unblocked";
        } else {
            $user->blocked_at = now();
            $message = $user->name . " has been blocked";
        }

        $user->save();

        Mail::to($user)->send(new UserBlockedUnblocked($user));

        return response()->json([
            'message' => $message
        ]);
    }
}