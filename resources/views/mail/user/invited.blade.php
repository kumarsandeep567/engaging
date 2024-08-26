<x-mail::message>
# Hey {{ $user->name }}! <br>

We're excited to invite you to experience the all-new **{{ config('app.name') }} Messenger**! 🎉 <br>

Connect with friends, share moments, and stay in the loop—it's all waiting for you. <br>
Jump in and start exploring now! <br>

*Don't have an account?* We've already created one specially for you! <br>

To login, simply use these credentials: <br>
Email: {{$user->email}} <br>
Password: {{$password}} <br>

<x-mail::button url="{{ route('login') }}">
Click Here To Sign In
</x-mail::button>


Looking forward to seeing you there! <br>

Cheers, <br>
The {{ config('app.name') }} Team

<x-mail::footer>
#### Heads Up! <br>
*Do not forget to reset your password after you sign in* <br>
*To reset your password, visit the profile page*
</x-mail::footer>

</x-mail::message>
