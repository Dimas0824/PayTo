<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_can_access_landing_page(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('storefront/landing'));
    }

    /** @test */
    public function landing_page_only_shows_featured_public_active_products(): void
    {
        // Featured, public, active - should show
        $featuredProduct = Product::factory()->create([
            'name' => 'Featured Product',
            'is_active' => true,
            'is_public' => true,
            'featured' => true,
        ]);

        // Public but not featured - should not show
        Product::factory()->create([
            'name' => 'Public Product',
            'is_active' => true,
            'is_public' => true,
            'featured' => false,
        ]);

        // Featured but not public - should not show
        Product::factory()->create([
            'name' => 'Private Product',
            'is_active' => true,
            'is_public' => false,
            'featured' => true,
        ]);

        // Inactive - should not show
        Product::factory()->create([
            'name' => 'Inactive Product',
            'is_active' => false,
            'is_public' => true,
            'featured' => true,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('featured_products', 1)
            ->where('featured_products.0.name', 'Featured Product')
        );
    }

    /** @test */
    public function guest_can_access_catalog_page(): void
    {
        $response = $this->get('/katalog');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('storefront/catalog'));
    }

    /** @test */
    public function catalog_only_shows_active_and_public_products(): void
    {
        // Active and public - should show
        $publicProduct = Product::factory()->create([
            'name' => 'Public Product',
            'is_active' => true,
            'is_public' => true,
        ]);

        // Not public - should not show
        Product::factory()->create([
            'name' => 'Private Product',
            'is_active' => true,
            'is_public' => false,
        ]);

        // Not active - should not show
        Product::factory()->create([
            'name' => 'Inactive Product',
            'is_active' => false,
            'is_public' => true,
        ]);

        $response = $this->get('/katalog');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Public Product')
        );
    }

    /** @test */
    public function catalog_supports_search(): void
    {
        Product::factory()->create([
            'name' => 'Kopi Latte',
            'is_active' => true,
            'is_public' => true,
        ]);

        Product::factory()->create([
            'name' => 'Teh Manis',
            'is_active' => true,
            'is_public' => true,
        ]);

        $response = $this->get('/katalog?search=Kopi');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Kopi Latte')
            ->where('search', 'Kopi')
        );
    }

    /** @test */
    public function guest_can_access_product_detail_by_slug(): void
    {
        $product = Product::factory()->create([
            'name' => 'Kopi Latte',
            'slug' => 'kopi-latte',
            'is_active' => true,
            'is_public' => true,
        ]);

        $response = $this->get('/katalog/'.$product->slug);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('storefront/product-detail')
            ->where('product.slug', 'kopi-latte')
        );
    }

    /** @test */
    public function product_detail_returns_404_for_nonpublic_product(): void
    {
        $product = Product::factory()->create([
            'slug' => 'private-product',
            'is_active' => true,
            'is_public' => false,
        ]);

        $response = $this->get('/katalog/'.$product->slug);

        $response->assertStatus(404);
    }

    /** @test */
    public function product_detail_returns_404_for_inactive_product(): void
    {
        $product = Product::factory()->create([
            'slug' => 'inactive-product',
            'is_active' => false,
            'is_public' => true,
        ]);

        $response = $this->get('/katalog/'.$product->slug);

        $response->assertStatus(404);
    }

    /** @test */
    public function public_product_props_do_not_include_internal_fields(): void
    {
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'price' => 10000,
            'cost' => 5000, // Internal field
            'is_active' => true,
            'is_public' => true,
            'featured' => true,
        ]);

        $response = $this->get('/katalog/'.$product->slug);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('product.name')
            ->has('product.price')
            ->missing('product.cost')
            ->missing('product.is_active')
            ->missing('product.is_public')
            ->missing('product.featured')
        );
    }

    /** @test */
    public function product_with_discount_shows_price_after_discount(): void
    {
        $product = Product::factory()->create([
            'name' => 'Discounted Product',
            'slug' => 'discounted-product',
            'price' => 10000,
            'discount' => 10, // 10% discount
            'is_active' => true,
            'is_public' => true,
        ]);

        $response = $this->get('/katalog/'.$product->slug);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('product.price', 10000)
            ->where('product.discount', 10)
            ->where('product.price_after_discount', 9000)
            ->where('product.has_discount', true)
        );
    }
}
