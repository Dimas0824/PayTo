<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\PosLoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PosLoginController extends Controller
{
    public function store(PosLoginRequest $request): JsonResponse
    {
        $loginMethod = strtoupper((string) $request->input('login_method'));

        $user = match ($loginMethod) {
            'PIN' => User::fetchForPin((string) $request->input('pin')),
            default => User::fetchForLogin((string) $request->input('username'), (string) $request->input('password')),
        };

        if (! $user) {
            return response()->json([
                'message' => 'Kredensial tidak valid.',
            ], 422);
        }

        $today = now()->toDateString();
        $workDate = $user->work_date?->toDateString();
        $workSeconds = $workDate === $today ? (int) $user->work_seconds : 0;

        if ($workDate === $today && $user->last_login_at) {
            $lastLogoutAt = $user->last_logout_at;
            $hasOpenSession = ! $lastLogoutAt || $lastLogoutAt->lessThan($user->last_login_at);

            if ($hasOpenSession) {
                $workSeconds += $user->last_login_at->diffInSeconds(now());
            }
        }

        $user->forceFill([
            'last_login_at' => now(),
            'work_date' => $today,
            'work_seconds' => $workSeconds,
        ])->save();

        Auth::login($user);
        $request->session()->regenerate();

        $redirect = $user->role === 'SUPERVISOR' ? '/admin' : '/kasir';

        return response()->json([
            'redirect' => $redirect,
        ]);
    }
}
