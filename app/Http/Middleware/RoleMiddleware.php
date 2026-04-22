<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * @var list<string>
     */
    protected array $roles = [];

    public function __construct(string ...$roles)
    {
        $this->roles = array_values($roles);
    }

    public function handle(Request $request, Closure $next, string ...$routeRoles): Response
    {
        $allowed = count($routeRoles) > 0 ? $routeRoles : $this->roles;

        if (! $request->user()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (! in_array($request->user()->role, $allowed, true)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
