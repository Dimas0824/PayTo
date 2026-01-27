<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('landingPage');
});

Route::get('/login', function () {
    return inertia('login');
});

Route::get('/kasir', [\App\Http\Controllers\Pos\PosController::class, 'index']);

Route::get('/admin', function () {
    return inertia('admin');
});
