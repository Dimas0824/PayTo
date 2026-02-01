<?php

use Illuminate\Support\Facades\Route;

// POS API endpoints
Route::get('/admin/dashboard', [\App\Http\Controllers\Api\AdminDashboardController::class, 'index']);
Route::get('/admin/products', [\App\Http\Controllers\Api\ProductQueryController::class, 'index']);
Route::post('/admin/products', [\App\Http\Controllers\Api\ProductQueryController::class, 'store']);
Route::get('/admin/products/{product}', [\App\Http\Controllers\Api\ProductQueryController::class, 'show']);
Route::put('/admin/products/{product}', [\App\Http\Controllers\Api\ProductQueryController::class, 'update']);
Route::delete('/admin/products/{product}', [\App\Http\Controllers\Api\ProductQueryController::class, 'destroy']);
Route::get('/admin/inventory/recommendations', [\App\Http\Controllers\Api\InventoryRecommendationController::class, 'index']);
Route::get('/admin/receipt-settings', [\App\Http\Controllers\Api\ReceiptSettingsController::class, 'index']);
Route::put('/admin/receipt-settings', [\App\Http\Controllers\Api\ReceiptSettingsController::class, 'update']);
Route::get('/admin/staff', [\App\Http\Controllers\Api\StaffManagementController::class, 'index']);
Route::post('/admin/staff', [\App\Http\Controllers\Api\StaffManagementController::class, 'store']);
Route::get('/admin/staff/{user}', [\App\Http\Controllers\Api\StaffManagementController::class, 'show']);
Route::put('/admin/staff/{user}', [\App\Http\Controllers\Api\StaffManagementController::class, 'update']);
Route::delete('/admin/staff/{user}', [\App\Http\Controllers\Api\StaffManagementController::class, 'destroy']);
Route::post('/admin/staff/{user}/reset-pin', [\App\Http\Controllers\Api\StaffManagementController::class, 'resetPin']);
Route::get('/pos/products', [\App\Http\Controllers\Api\PosApiController::class, 'products']);
Route::get('/pos/history', [\App\Http\Controllers\Api\PosApiController::class, 'history']);
Route::get('/pos/profile', [\App\Http\Controllers\Api\PosApiController::class, 'profile']);
Route::post('/pos/checkout', [\App\Http\Controllers\Api\PosCheckoutController::class, 'store']);
Route::post('/pos/logout', [\App\Http\Controllers\Auth\PosLogoutController::class, 'store']);
Route::get('/pos/settings', [\App\Http\Controllers\Api\PosSettingsController::class, 'index']);
Route::post('/pos/settings/printer', [\App\Http\Controllers\Api\PosSettingsController::class, 'updatePrinter']);
Route::post('/pos/settings/printer/test', [\App\Http\Controllers\Api\PosSettingsController::class, 'testPrinter']);
Route::post('/pos/settings/refresh', [\App\Http\Controllers\Api\PosSettingsController::class, 'refreshSync']);
