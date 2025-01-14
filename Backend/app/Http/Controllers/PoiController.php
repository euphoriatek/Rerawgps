<?php
namespace App\Http\Controllers;

use App\Models\Poi;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class PoiController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:pois,name',
                'description' => 'required|string',
                'lat' => 'required|numeric',
                'lng' => 'required|numeric',
                'map_icon_id' => 'nullable|integer', 
            ]);
            $poi = Poi::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'map_icon_id' => $request->input('map_icon_id', null),
                'lat' => $request->input('lat'),
                'lng' => $request->input('lng'),
                'status' => 'pending',
            ]);
            return response()->json([
                'status'=>true,
                'name' => $poi->name,
                'description' => $poi->description,
                'map_icon_id' => $poi->map_icon_id ?? 0,
                'coordinates' => [
                    'lat' => $poi->lat,
                    'lng' => $poi->lng,
                ],
            ], 201);

        }catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function getPendingPois()
    {
        try {
            $pendingPois = Poi::where('status', 'pending')->get(); 
            return response()->json([
                'status' => true,
                'data' => $pendingPois
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function getPois()
    {
        try {
            // Fetch all POIs (no filter on status)
            $pois = Poi::all();
    
            return response()->json([
                'status' => true,
                'data' => $pois
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while fetching POIs: ' . $e->getMessage(),
            ], 500);
        }
    }
}

