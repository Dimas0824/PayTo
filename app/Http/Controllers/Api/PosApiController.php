<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Pos\HistoryQueryController;
use App\Http\Controllers\Pos\ProductQueryController;
use App\Http\Controllers\Pos\ProfileQueryController;
use Illuminate\Http\Request;

class PosApiController extends Controller
{
    public function products(Request $request)
    {
        $controller = new ProductQueryController;

        return response()->json(['data' => $controller->fetch()]);
    }

    public function history(Request $request)
    {
        $limit = (int) $request->query('limit', 10);
        $controller = new HistoryQueryController;

        return response()->json(['data' => $controller->fetch($limit)]);
    }

    public function profile(Request $request)
    {
        $userId = $request->query('user_id');
        $controller = new ProfileQueryController;

        return response()->json(['data' => $controller->fetch($userId ? (int) $userId : null)]);
    }
}
