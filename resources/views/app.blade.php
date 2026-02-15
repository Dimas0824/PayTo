<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#4F46E5">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="webpush-public-key" content="{{ config('services.webpush.vapid.public_key') }}">
    <title>{{ config('app.name', 'PayTo') }}</title>
    <link rel="icon" type="image/png" href="{{ asset('storage/logs-removed.png') }}">
    <link rel="shortcut icon" href="{{ asset('storage/logs-removed.png') }}">
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <link rel="apple-touch-icon" href="{{ asset('favicon.ico') }}">

    @inertiaHead

    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>

<body class="antialiased">
    @inertia
</body>

</html>
