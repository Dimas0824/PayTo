<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StaffManagementApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_crud_and_reset_pin_flow(): void
    {
        $payload = [
            'name' => 'Staf Baru',
            'username' => 'staf.baru',
            'role' => 'CASHIER',
            'is_active' => true,
            'password' => 'password123',
            'pin' => '123456',
        ];

        $createResponse = $this->postJson('/api/admin/staff', $payload)
            ->assertCreated()
            ->assertJsonPath('data.username', 'staf.baru');

        $staffId = $createResponse->json('data.id');

        $this->getJson('/api/admin/staff')
            ->assertOk()
            ->assertJsonFragment([
                'id' => $staffId,
                'username' => 'staf.baru',
            ]);

        $this->getJson("/api/admin/staff/{$staffId}")
            ->assertOk()
            ->assertJsonPath('data.name', 'Staf Baru');

        $this->putJson("/api/admin/staff/{$staffId}", [
            'name' => 'Staf Update',
            'is_active' => false,
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Staf Update')
            ->assertJsonPath('data.status', 'INACTIVE');

        $this->postJson("/api/admin/staff/{$staffId}/reset-pin", [
            'pin' => '654321',
        ])
            ->assertOk();

        $user = User::query()->find($staffId);

        $this->assertNotNull($user);
        $this->assertTrue(Hash::check('654321', $user->pin_hash));

        $this->deleteJson("/api/admin/staff/{$staffId}")
            ->assertOk();

        $this->assertDatabaseMissing('users', [
            'id' => $staffId,
        ]);
    }

    public function test_staff_validation_rejects_duplicate_username_and_invalid_pin(): void
    {
        $user = new User;
        $user->name = 'Existing';
        $user->username = 'dupe.user';
        $user->password_hash = bcrypt('secret');
        $user->role = 'CASHIER';
        $user->is_active = true;
        $user->save();

        $this->postJson('/api/admin/staff', [
            'name' => 'Dup',
            'username' => 'dupe.user',
            'role' => 'CASHIER',
            'password' => 'password123',
            'pin' => '123456',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['username']);

        $this->postJson("/api/admin/staff/{$user->id}/reset-pin", [
            'pin' => '12',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['pin']);
    }
}
