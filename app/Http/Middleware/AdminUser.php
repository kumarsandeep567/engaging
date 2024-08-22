<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Reject any response regarding Administrator privileges if
        // the user is not an administrator
        if (!auth()->user()->is_admin) {
            abort(403, "Unauthorized Access");
        }

        return $next($request);
    }
}
