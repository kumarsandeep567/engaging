<x-mail::message>
Hello {{ $user->name }}, <br>

@if ($user->is_admin)
Great news! Your account has been granted administrator privileges! Use them responsibily! <br>
<br>
<x-mail::button url="{{ route('login') }}">
Click Here To Sign In
</x-mail::button>
@else
Uh oh! Your Administrator privileges have been revoked. <br>
Please contact an administrator if you think this is a mistake. <br>
@endif

Regards, <br>
The {{ config('app.name') }} Team
</x-mail::message>