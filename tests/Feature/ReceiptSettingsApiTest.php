<?php

namespace Tests\Feature;

use App\Models\AppSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReceiptSettingsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_receipt_settings_can_be_retrieved_and_saved(): void
    {
        $this->getJson('/api/admin/receipt-settings')
            ->assertOk()
            ->assertJsonStructure([
                'data' => ['header', 'footer'],
            ]);

        $payload = [
            'header' => "Header Baru\nAlamat Baru",
            'footer' => 'Terima kasih',
        ];

        $this->putJson('/api/admin/receipt-settings', $payload)
            ->assertOk()
            ->assertJsonPath('data.header', $payload['header'])
            ->assertJsonPath('data.footer', $payload['footer']);

        $setting = AppSetting::query()->where('key', 'receipt.settings')->first();

        $this->assertNotNull($setting);
        $this->assertSame($payload['header'], $setting->value['header'] ?? null);
        $this->assertSame($payload['footer'], $setting->value['footer'] ?? null);
    }
}
