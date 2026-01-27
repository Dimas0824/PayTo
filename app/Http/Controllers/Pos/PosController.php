<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index(Request $request)
    {
        $productQuery = new ProductQueryController;
        $historyQuery = new HistoryQueryController;
        $profileQuery = new ProfileQueryController;

        $products = $productQuery->fetch();
        $history = $historyQuery->fetch(10);
        $profile = $profileQuery->fetch();

        return Inertia::render('kasir', [
            'products' => $products,
            'history' => $history,
            'profile' => $profile,
        ]);
    }
}
