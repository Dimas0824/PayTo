<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosLogoutController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $user->forceFill([
                'last_logout_at' => now(),
            ])->save();
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'status' => 'ok',
        ]);
    }
}
