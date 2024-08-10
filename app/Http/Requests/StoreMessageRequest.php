<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * To prevent storing the messages in the database, simply set authorize()
     * to return false.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'message'       => 'nullable|string',

            // Group ID is needed if Receiver ID is null
            'group_id'      => 'required_without:receiver_id|nullable|exists:groups,id',

            // Receiver ID is needed if Group ID is null
            'receiver_id'   => 'required_without:group_id|nullable|exists:users,id',

            // Number of files that can be uploaded at a time
            'attachments'   => 'nullable|array|max:10',

            // Largest file size allowed is 1GB
            'attachments.*' => 'file|max:1024000'
        ];
    }
}
