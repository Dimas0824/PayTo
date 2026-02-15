<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PushSubscriptionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_store_and_delete_push_subscription(): void
    {
        $payload = [
            'endpoint' => 'https://example.com/push/test-endpoint',
            'keys' => [
                'p256dh' => 'BPOt8G6HUpushPublicKeyValue',
                'auth' => 'exampleAuthToken',
            ],
            'contentEncoding' => 'aes128gcm',
        ];

        $this->postJson('/api/push/subscriptions', $payload)
            ->assertOk()
            ->assertJsonPath('data.endpoint', 'https://example.com/push/test-endpoint');

        $this->assertDatabaseHas('push_subscriptions', [
            'endpoint' => 'https://example.com/push/test-endpoint',
            'content_encoding' => 'aes128gcm',
        ]);

        $this->deleteJson('/api/push/subscriptions', [
            'endpoint' => 'https://example.com/push/test-endpoint',
        ])->assertOk();

        $this->assertDatabaseMissing('push_subscriptions', [
            'endpoint' => 'https://example.com/push/test-endpoint',
        ]);
    }
}
