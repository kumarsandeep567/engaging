<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * 
     * Use this resource to control 
     * what user data should be returned.
     * 
     * @return array<string, mixed>
     */

    // By default, disable JSON wrapping
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'avatar_url'        => $this->avatar ? Storage::url($this->avatar) : null,
            'name'              => $this->name,
            'email'             => $this->emaiil,
            'updated_at'        => $this->updated_at,
            'created_at'        => $this->created_at,
            'is_admin'          => (bool) $this->is_admin,

            // These fields are not available in the database
            // but will be dynamically generated later when 
            // new users are created (default value is null)
            'last_message'      => $this->last_message,
            'last_message_date' => $this->last_message_date
        ];
    }
}
