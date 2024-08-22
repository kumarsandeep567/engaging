<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $avatar = $request->file('avatar');
        $user = $request->user();
        $data = $request->validated();

        // Update the user's avatar
        if ($avatar) {

            // Delete the existing avatar, if any
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Generate a unique name for every avatar that is saved
            $avatarName = uniqid('avatar_') . '.' . $avatar->getClientOriginalExtension();

            // Save the avatar in the 'public' directory
            $user->avatar = $data['avatar'] = $avatar->storeAs('avatars', $avatarName,'public');
        }

        // Reset data['avatar']
        unset($data['avatar']);

        $user->fill($data);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
