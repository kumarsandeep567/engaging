<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Jobs\DeleteGroupJob;

class GroupController extends Controller
{
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        // Validate the request with the owner id via StoreGroupRequest.php
        $data = $request->validated();

        // Get the list of user_ids that will be a member of this group
        $user_ids = $data['user_ids'] ?? [];

        // Create the group
        $group = Group::create($data);

        // Add the user_ids, along with the current user, to the group
        $group->users()->attach(array_unique([
            $request->user()->id,
            ...$user_ids
        ]));

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        // Validate the request with the owner id via StoreGroupRequest.php
        $data = $request->validated();

        // Get the list of user_ids that will be a member of this group
        $user_ids = $data['user_ids'] ?? [];

        // Update the group
        $group->update($data);

        // Remove all users and reattach them along with the new ones
        $group->users()->detach();
        $group->users()->attach(array_unique([
            $request->user()->id,
            ...$user_ids
        ]));

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        // Only group owners are allowed to delete the group
        if ($group->owner_id !== auth()->id())
        {
            abort(403);
        }

        // Delete the group after 30 seconds
        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(10));
        
        // Send a deletion scheduled response
        return response()->json([
            'message' => "Deletion initiated: This group has been marked for deletion and will be deleted soon ..."
        ]);
    }
}
