<?php

/**
 * Provides profile data for the admin profile tab.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $user = request()->user();
        if (!$user || $user->role !== 'SUPERVISOR') {
            $user = User::query()->where('role', 'SUPERVISOR')->orderBy('id')->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Admin tidak ditemukan.'], 404);
        }

        $email = $user->username && str_contains($user->username, '@')
            ? $user->username
            : '—';

        return response()->json([
            'data' => [
                'name' => $user->name ?? 'Admin',
                'role' => $user->role ?? 'SUPERVISOR',
                'id' => sprintf('SPV-%03d', $user->id),
                'email' => $email,
                'phone' => '—',
                'joinDate' => $user->created_at?->locale('id')->translatedFormat('d F Y') ?? '—',
                'lastLogin' => $user->last_login_at?->locale('id')->diffForHumans() ?? '—',
            ],
        ]);
    }
}
