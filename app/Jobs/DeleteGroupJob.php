<?php

namespace App\Jobs;

use App\Models\Group;
use App\Events\GroupDeleted;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteGroupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Group $group)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Maintain integrity constraints and avoid foreign key errors,
        // update the foreign key to be null
        $this->group->last_message_id = null;
        $this->group->save();

        // Iterate over each message in the group and delete it
        // Deleting the attachments and updating the database will be handled
        // by MessageObserver
        $this->group->messages->each->delete();

        // Remove all the users from the group
        $this->group->users()->detach();

        // Finally, delete the group
        $this->group->delete();

        // Broadcast the Group deleted event
        GroupDeleted::dispatch(
            $this->group->id, 
            $this->group->name
        );
    }
}
    