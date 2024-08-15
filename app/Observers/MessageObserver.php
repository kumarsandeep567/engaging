<?php

namespace App\Observers;

use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    /**
     * When a message delete request is received, delete any attachments
     * associated with the message.
     */
    public function deleting(Message $message)
    {

        // Iterate over the provided message's attachments, and delete them 
        // from the database and the file system.
        $message->attachments->each(function ($attachment) {

            // Locate the attachment on the disk and delete it.
            $dir = dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);
        });

        // Delete the record related to the attachment from the database.
        $message->attachments()->delete();

        // If the deleted message happens to be the last message in the 
        // conversation, then the conversation will be updated to have a 
        // new last message.

        // If the conversation is a group chat.
        if($message->group_id)
        {
            $group = Group::where('last_message_id', $message->id)->first();

            // Set the second last message to be the new last message.
            if($group)
            {
                $previousMessage = Message::where('group_id', $message->group_id)
                ->where('id', '!=', $message->id)
                ->latest()
                ->limit(1)
                ->first();

                if($previousMessage)
                {
                    $group->last_message_id = $previousMessage->id;
                    $group->save();
                }
            }
        }
        else
        {
            // If the conversation is a personal chat.
            $conversation = Conversation::where('last_message_id', $message->id)->first();

            // Set the second last message to be the new last message.
            if($conversation)
            {
                    $previousMessage = Message::where(function ($query) use ($message) {
                        $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                    })
                    ->where('id', '!=', $message->id)
                    ->latest()
                    ->limit(1)
                    ->first();

                    if($previousMessage)
                    {
                        $conversation->last_message_id = $previousMessage->id;
                        $conversation->save();
                    }
                }
            }
    }
}