<?php

namespace App\Http\Controllers\Pos;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Support\Carbon;

class ProfileQueryController
{
    public function fetch(?int $userId = null): array
    {
        $user = $userId ? User::find($userId) : auth()->user();
        $user ??= User::first();

        $today = Carbon::now()->startOfDay();
        $salesQuery = Sale::query()
            ->when($user?->id, fn ($q) => $q->where('cashier_id', $user->id))
            ->whereDate('occurred_at', $today);

        $transactionsToday = $salesQuery->count();
        $totalToday = (float) $salesQuery->sum('grand_total');
        $loginAt = $user?->last_login_at ? Carbon::parse($user->last_login_at) : null;
        $logoutAt = $user?->last_logout_at ? Carbon::parse($user->last_logout_at) : null;

        $durationText = '—';
        if ($loginAt) {
            $endAt = $logoutAt ?? Carbon::now();
            $diff = $loginAt->diff($endAt);
            $hours = $diff->h + ($diff->days * 24);
            $minutes = $diff->i;
            $durationText = sprintf('%dh %02dm', $hours, $minutes);
        }

        $target = 1000000;
        $progress = $target > 0 ? round(($totalToday / $target) * 100) : 0;

        $role = match ($user?->role) {
            'CASHIER' => 'KASIR',
            'SUPERVISOR' => 'ADMIN',
            default => $user?->role ?? 'KASIR',
        };

        return [
            'id' => $user?->id,
            'displayName' => $user?->name ?? 'Kasir',
            'employeeId' => $user ? sprintf('KSR-%03d', $user->id) : null,
            'role' => $role,
            'isActive' => (bool) ($user?->is_active ?? false),
            'totalToday' => $totalToday,
            'transactionsToday' => $transactionsToday,
            'shiftStart' => $loginAt?->format('H:i'),
            'shiftEnd' => $logoutAt?->format('H:i'),
            'shiftDuration' => $durationText,
            'target' => $target,
            'progressPercent' => $progress,
        ];
    }
}
