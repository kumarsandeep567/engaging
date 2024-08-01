<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Queue\SerializesModels;
use App\Http\Resources\MessageResource;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance with the Message property.
     */
    public function __construct(public Message $message)
    {
        //
    }


    /**
     * Instead of directly returning the $message with the properties of
     * the Message model, let MessageResource handle what data to return.
     */
    public function broadcastWith(): array
    {
        return [
            'message' => new MessageResource($this->message)
        ];   
    }


    /**
     * Get the channels the event should broadcast on.
     * To avoid duplication of channels for personal chats, ensure 
     * that userId1 < userId2 
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [];
        $message  = $this->message;

        if ($message->group_id)
        {
            $channels[] = new PrivateChannel('message.group.' . $message->group_id);
        }
        else
        {
            $channels[] = new PrivateChannel(
                    'message.user.'.collect([
                        $message->sender_id,
                        $message->receiver_id,
                    ])
                    ->sort()
                    ->implode('-')
                );
        }

        return $channels;
    }
}
