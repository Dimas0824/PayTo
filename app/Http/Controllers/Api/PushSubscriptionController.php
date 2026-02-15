<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PushSubscriptionStoreRequest;
use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class PushSubscriptionController extends Controller
{
    public function store(PushSubscriptionStoreRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $user = $request->user();

        $subscription = PushSubscription::query()->updateOrCreate(
            ['endpoint' => (string) $payload['endpoint']],
            [
                'user_id' => $user?->id,
                'public_key' => (string) $payload['keys']['p256dh'],
                'auth_token' => (string) $payload['keys']['auth'],
                'content_encoding' => (string) ($payload['contentEncoding'] ?? 'aesgcm'),
                'user_agent' => (string) $request->userAgent(),
                'last_seen_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Push subscription tersimpan.',
            'data' => [
                'id' => $subscription->id,
                'endpoint' => $subscription->endpoint,
            ],
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'endpoint' => ['required', 'string', 'max:512'],
        ]);

        PushSubscription::query()->where('endpoint', (string) $validated['endpoint'])->delete();

        return response()->json([
            'message' => 'Push subscription dihapus.',
        ]);
    }

    public function sendTest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:100'],
            'body' => ['nullable', 'string', 'max:255'],
        ]);

        $subscriptions = PushSubscription::query()->get();
        if ($subscriptions->isEmpty()) {
            return response()->json([
                'message' => 'Belum ada subscription push.',
            ], 422);
        }

        $publicKey = (string) config('services.webpush.vapid.public_key');
        $privateKey = (string) config('services.webpush.vapid.private_key');
        $subject = (string) config('services.webpush.vapid.subject');

        if ($publicKey === '' || $privateKey === '' || $subject === '') {
            return response()->json([
                'message' => 'Konfigurasi VAPID belum lengkap.',
            ], 422);
        }

        $webPush = new WebPush([
            'VAPID' => [
                'subject' => $subject,
                'publicKey' => $publicKey,
                'privateKey' => $privateKey,
            ],
        ]);

        $payload = json_encode([
            'title' => $validated['title'] ?? 'Notifikasi PayTo',
            'body' => $validated['body'] ?? 'Push notification berhasil dikirim.',
        ]);

        foreach ($subscriptions as $subscription) {
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint' => $subscription->endpoint,
                    'publicKey' => $subscription->public_key,
                    'authToken' => $subscription->auth_token,
                    'contentEncoding' => $subscription->content_encoding,
                ]),
                $payload
            );
        }

        $successCount = 0;
        $failedCount = 0;
        foreach ($webPush->flush() as $report) {
            if ($report->isSuccess()) {
                $successCount++;
            } else {
                $failedCount++;
            }
        }

        return response()->json([
            'message' => 'Pengiriman test push selesai.',
            'data' => [
                'sent' => $successCount,
                'failed' => $failedCount,
            ],
        ]);
    }
}
