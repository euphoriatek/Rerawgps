<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use App\Models\Poi;

class HistoryController extends Controller
{
    
    public function getHistory()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User is not authenticated.',
                ], 401);
            }
            $history = History::with(['group', 'salesAgent'])
                ->get()
                ->map(function ($item) {
                    $poisIds = json_decode($item->pois_id, true);
                    $item->pois = Poi::whereIn('id', $poisIds)->get();
                    return $item;
             });
            return response()->json([
                'status' => true,
                'message' => 'plans records fetched successfully!',
                'data' => $history,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch plans records.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
