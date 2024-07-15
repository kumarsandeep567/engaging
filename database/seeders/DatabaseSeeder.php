<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        /**
         * Generate dummy data for Users
         */

        // Create one admin user
        User::factory()->create([
            'name'      => 'Ryan Gosling',
            'email'     => 'ryan@example.com',
            'password'  => bcrypt('password'),
            'is_admin'  => true
        ]);

        // Create one non-admin user
        User::factory()->create([
            'name'      => 'Emma Stone',
            'email'     => 'emma@example.com',
            'password'  => bcrypt('password')
        ]);

        // Generate another 10 random users
        User::factory(10)->create();

        for ($i = 0; $i < 5; $i++)
        {
            // Create 5 groups where 'owner_id' is 1
            $group = Group::factory()->create([
                "owner_id" => 1,
            ]);

            // Get 2-5 random users
            $users = User::inRandomOrder()->limit(rand(2, 5))->pluck("id");

            // Add these users to the group (avoid duplicates)
            $group->users()->attach(array_unique([1, ...$users]));
        }

        // Generate 1000 random messages
        Message::factory(1000)->create();

        /**
         * Fetch the messages that do not belong to a group chat
         * (get the messages that belong to a personal conversation
         * i.e., 1:1 chat)
         */
        $messages = Message::whereNull("group_id")
            ->orderBy("created_at")
            ->get();

        $conversations = $messages
            ->groupBy(function ($message) {
                return collect([$message->sender_id, $message->receiver_id])
                    ->sort()
                    ->implode("_");
            })
            ->map(function ($groupedMessages) {
                return [
                'user_id1'        => $groupedMessages->first()->sender_id,
                'user_id2'        => $groupedMessages->first()->receiver_id,
                'last_message_id' => $groupedMessages->last()->id,
                'created_at'      => new Carbon(),
                'updated_at'      => new Carbon()
                ];
            })
            ->values();

        Conversation::insertOrIgnore($conversations->toArray());
    }
}
