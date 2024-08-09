<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Group;
use Inertia\Response;
use App\Models\Message;
use Illuminate\Support\Str;
use App\Models\Conversation;
use App\Events\SocketMessage;
use App\Models\MessageAttachment;
use App\Http\Resources\MessageResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreMessageRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageController extends Controller
{
    /**
     * Method to load messages based on the selected user.
     * The currently authenticated user must either be 
     * the sender of the message or the receipent.
     * Fetch only 10 messages from the latest message.
     */
    public function byUser(User $user): Response
    {
        $messages = Message::where('sender_id', auth()->id())
        ->where('receiver_id', $user->id)
        ->orWhere('sender_id', $user->id)
        ->where('receiver_id', auth()->id())
        ->latest()
        ->paginate(10);

        // Forward these messages to the HomePage to 
        // render them on ChatLayout, and to MessageResource
        return inertia('Home', [
            'selectedConversation'  => $user->toConversationArray(),
            'messages'              => MessageResource::collection($messages)
        ]);
    }

    /** 
     * Method to load messages based on the selected group.
     * Fetch only 10 messages from the latest message.
     */
    public function byGroup(Group $group): Response
    {
        $messages = Message::where('group_id', $group->id)
        ->latest()
        ->paginate(10);

        // Forward these messages to the Home to render them on ChatLayout
        // Let MessageResource handle what fields to return for the messages
        return inertia('Home', [
            'selectedConversation'  => $group->toConversationArray(),
            'messages'              => MessageResource::collection($messages)
        ]);
    }

    /**
     * Method to load 10 messages older than the provided message
     * and sort them in ascending order (latest message at the bottom).
     */
    public function loadOlderMessages(Message $message): AnonymousResourceCollection
    {
        if ($message->group_id) 
        {
            $messages = Message::where('created_at', '<', $message->created_at)
            ->where('group_id', '=', $message->group_id)
            ->latest()
            ->paginate(10);
        }
        else
        {
            $messages = Message::where('created_at', '<', $message->created_at)
            ->where(function ($query) use ($message) {
                $query->where('sender_id', $message->sender_id)
                ->where('receiver_id', $message->receiver_id)
                ->orWhere('sender_id', $message->receiver_id)
                ->where('receiver_id', $message->sender_id);
            })
            ->latest()
            ->paginate(10);
        }

        // Let MessageResource handle what fields to return
        return MessageResource::collection($messages);
    }
 
    /**
     * Method to store message requests in the public directory
     * present in the Storage directory
     */
    public function store(StoreMessageRequest $request)
    {
        $data               = $request->validated();
        $data['sender_id']  = auth()->id();

        $receiver_id    = $data['receiver_id'] ?? null;
        $group_id       = $data['group_id'] ?? null;

        $files          = $data['attachments'] ?? [];
        $message        = Message::create($data);
        $attachments    = [];

        if ($files)
        {
            foreach($files as $file)
            {
                /**
                 * Create a new directory with the 'attachments' prefix
                 * followed by a random string of 32 characters for
                 * every new file received
                 */
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);

                // Associate the attachment to the message
                $model = [
                    'message_id'    => $message->id,
                    'name'          => $file->getClientOriginalName(),
                    'mime'          => $file->getClientMimeType(),
                    'size'          => $file->getSize(),
                    'path'          => $file->store($directory, 'public')
                ];

                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }

        /**
         * The message is ready to be broadcasted to the receipents.
         * If receiver_id exists, then the conversation is a personal
         * chat. If not, then the conversation is a group chat.
         */ 

        if ($receiver_id)
        {
            Conversation::updateConversationWithMessage($receiver_id, auth()->id(), $message);
        }

        if ($group_id)
        {
            Group::updateGroupWithMessage($group_id, $message);
        }

        // Broadcast the message
        SocketMessage::dispatch($message);

        return new MessageResource($message);
    }

    /**
     * Method to delete a message and return an HTTP 204
     */
    public function destroy(Message $message)
    {
        // Messages can be deleted only by their owners
        if ($message->sender_id !== auth()->id())
        {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        $message->delete();

        return response('', 204);
    }
}
