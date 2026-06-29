<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\Settings\AppSettingsService;
use App\Services\WhatsAppLinkBuilder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function __construct(
        private readonly AppSettingsService $settings,
        private readonly WhatsAppLinkBuilder $whatsappBuilder
    ) {}

    /**
     * Landing page - featured products only
     */
    public function index(): Response
    {
        $businessProfile = $this->settings->getBusinessProfile();
        $catalogSettings = $this->settings->getCatalogSettings();

        // Get featured products
        $featuredProducts = Product::query()
            ->where('is_active', true)
            ->where('is_public', true)
            ->where('featured', true)
            ->select(['id', 'name', 'slug', 'price', 'discount', 'image_path'])
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                return $this->formatProductForPublic($product);
            });

        return Inertia::render('storefront/landing', [
            'business' => [
                'name' => $businessProfile['name'],
                'address' => $businessProfile['address'],
                'whatsapp_number' => $businessProfile['whatsapp_number'],
                'operating_hours' => $businessProfile['operating_hours'],
            ],
            'catalog_enabled' => $catalogSettings['enabled'],
            'whatsapp_enabled' => $catalogSettings['whatsapp_enabled'],
            'featured_products' => $featuredProducts,
        ]);
    }

    /**
     * Catalog page - all public products with search & pagination
     */
    public function catalog(Request $request): Response
    {
        $catalogSettings = $this->settings->getCatalogSettings();

        // Check if catalog is enabled
        if (! $catalogSettings['enabled']) {
            return Inertia::render('storefront/catalog-unavailable');
        }

        $search = $request->query('search', '');
        $perPage = 12;

        $query = Product::query()
            ->where('is_active', true)
            ->where('is_public', true)
            ->select(['id', 'name', 'slug', 'price', 'discount', 'image_path', 'description']);

        if ($search) {
            $query->where('name', 'LIKE', '%'.$search.'%');
        }

        $products = $query->orderBy('name')
            ->paginate($perPage)
            ->through(function ($product) {
                return $this->formatProductForPublic($product);
            });

        return Inertia::render('storefront/catalog', [
            'products' => $products,
            'search' => $search,
            'whatsapp_enabled' => $catalogSettings['whatsapp_enabled'],
        ]);
    }

    /**
     * Product detail page
     */
    public function show(Product $product): Response
    {
        $catalogSettings = $this->settings->getCatalogSettings();

        // Check if catalog is enabled
        if (! $catalogSettings['enabled']) {
            return Inertia::render('storefront/catalog-unavailable');
        }

        // Check if product is visible
        if (! $product->is_active || ! $product->is_public) {
            abort(404);
        }

        $whatsappLink = null;
        if ($catalogSettings['whatsapp_enabled']) {
            $whatsappLink = $this->whatsappBuilder->buildProductLink($product, 1);
        }

        return Inertia::render('storefront/product-detail', [
            'product' => $this->formatProductForPublic($product, true),
            'whatsapp_link' => $whatsappLink,
            'whatsapp_enabled' => $catalogSettings['whatsapp_enabled'],
        ]);
    }

    /**
     * Format product for public view (exclude internal fields)
     */
    private function formatProductForPublic(Product $product, bool $includeDescription = false): array
    {
        $data = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'discount' => (float) ($product->discount ?? 0),
            'price_after_discount' => $this->calculatePriceAfterDiscount($product->price, $product->discount ?? 0),
            'has_discount' => ($product->discount ?? 0) > 0,
            'image_url' => $product->image_path ? asset('storage/'.$product->image_path) : null,
        ];

        if ($includeDescription) {
            $data['description'] = $product->description;
        }

        // Do NOT include: cost, sku, barcode, stock, is_active, is_public, featured, internal IDs
        return $data;
    }

    /**
     * Calculate price after discount
     */
    private function calculatePriceAfterDiscount(float $price, float $discountPercent): float
    {
        $discountAmount = ($price * $discountPercent) / 100;

        return $price - $discountAmount;
    }
}
