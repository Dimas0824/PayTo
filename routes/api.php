<?php

use Illuminate\Support\Facades\Route;

// POS API endpoints
Route::get('/pos/products', [\App\Http\Controllers\Api\PosApiController::class, 'products']);
Route::get('/pos/history', [\App\Http\Controllers\Api\PosApiController::class, 'history']);
Route::get('/pos/profile', [\App\Http\Controllers\Api\PosApiController::class, 'profile']);
Route::post('/pos/checkout', [\App\Http\Controllers\Api\PosCheckoutController::class, 'store']);
Route::post('/pos/logout', [\App\Http\Controllers\Auth\PosLogoutController::class, 'store']);
Route::get('/pos/settings', [\App\Http\Controllers\Api\PosSettingsController::class, 'index']);
Route::post('/pos/settings/printer', [\App\Http\Controllers\Api\PosSettingsController::class, 'updatePrinter']);
Route::post('/pos/settings/printer/test', [\App\Http\Controllers\Api\PosSettingsController::class, 'testPrinter']);
Route::post('/pos/settings/refresh', [\App\Http\Controllers\Api\PosSettingsController::class, 'refreshSync']);
