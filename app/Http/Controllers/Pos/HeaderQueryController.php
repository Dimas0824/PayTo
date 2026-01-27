<?php

namespace App\Http\Controllers\Pos;

use App\Models\Product;
use App\Models\User;

class HeaderQueryController
{
    /**
     * Fetch header data used by the POS header bar.
     *
     * Returns an array with display_name, username, role and simple counts.
     */
    public function fetch(): array
    {
        $user = auth()->user() ?? User::query()->first();

        $profileController = new ProfileQueryController;
        $profile = $profileController->fetch($user?->id);

        $activeProducts = Product::query()->where('is_active', true)->count();

        return [
            'display_name' => $profile['displayName'] ?? ($user->name ?? $user->username ?? 'Kasir'),
            'username' => $user->username ?? null,
            'role' => $profile['role'] ?? ($user->role ?? null),
            'is_active' => $profile['isActive'] ?? (bool) ($user->is_active ?? true),
            'active_products_count' => $activeProducts,
            // surface a few profile metrics for convenience
            'total_today' => $profile['totalToday'] ?? 0,
            'transactions_today' => $profile['transactionsToday'] ?? 0,
            'shift_duration' => $profile['shiftDuration'] ?? '—',
        ];
    }
}
