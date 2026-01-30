<?php

use Illuminate\Support\Facades\Route;

// POS API endpoints
Route::get('/pos/products', [\App\Http\Controllers\Api\PosApiController::class, 'products']);
Route::get('/pos/history', [\App\Http\Controllers\Api\PosApiController::class, 'history']);
Route::get('/pos/profile', [\App\Http\Controllers\Api\PosApiController::class, 'profile']);
