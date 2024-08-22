<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ActiveUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Prevent the blocked user from performing any request by logging them out
        // if (auth()->user()->blocked_at) {
        //     auth()->logout();
        //     return redirect()
        //     ->route('login')
        //     ->with('error', 'Your account has been blocked. Please contact an administrator if you feel this was a mistake.');
        // }
        return $next($request);
    }
}
