<x-mail::message>
Hello {{ $user->name }}, <br>

@if ($user->blocked_at)
Unfortunately, your account has been blocked and your access to {{ config('app.name') }} Messenger has been restricted. <br>
If you feel this is a mistake, please contact an administrator as soon as possible. <br>
@else
Great News! Your account has been reinstated and your access to {{ config('app.name') }} Messenger has been enabled. <br>
<x-mail::button url="{{ route('login') }}">
Click Here To Sign In
</x-mail::button>
@endif

<br>

Regards, <br>
The {{ config('app.name') }} Team
</x-mail::message>