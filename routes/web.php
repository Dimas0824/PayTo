<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return inertia('login');
});

Route::get('/kasir', function () {
    return inertia('kasir');
});

Route::get('/admin', function () {
    return inertia('admin');
});
