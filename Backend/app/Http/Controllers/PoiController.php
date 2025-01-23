<?php
namespace App\Http\Controllers;

use App\Models\Poi;
use App\Models\User;
use App\Models\Servers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class PoiController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'description' => 'required|string',
                'coordinates.lat' => 'required|numeric|min:-90|max:90',
                'coordinates.lng' => 'required|numeric|min:-180|max:180',
                'map_icon_id' => 'nullable|integer',
                'regaykar_user_id' => 'required|numeric'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }
            $input = $request->all();
            $input['coordinates'] = json_encode($input['coordinates']);
            $poi = Poi::create($input);

            return response()->json([
                'status' => true,
                'message' => 'Poi added successfully!',
                'data' => $poi,
            ], 200);
        }catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function updatePoi(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id' => 'required|exists:pois,id',
                'name' => 'required|string',
                'description' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }
            $input = $request->all();
            $poi = Poi::find($input['id']);
            $poi->update(['name' => $input['name'],'description' => $input['description']]);
            return response()->json([
                'status' => true,
                'message' => 'Poi updated successfully!',
                'data' => $poi,
            ], 200);
        }catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function getPendingPois()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }
            $pendingPois = Poi::where('regaykar_user_id', $user->id)->where('status', 'pending')->get(); 
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
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }
            $pois = Poi::where('regaykar_user_id', $user->id)->where('status','approved')->with('groups.group')->get(); 
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

    // public function syncData()
    // {
    //     $users = User::with('server')->where('role', 'user')->get();
    //     foreach ($users as $user) {
    //         $masterPortsResponse = Http::get($user->server->server_url . '/api/get_user_map_icons', [
    //             'lang' => 'en',
    //             'user_api_hash' => $user->api_key,
    //         ]);
    //         $mapIcons = $masterPortsResponse->json()['items']['mapIcons'] ?? [];
    //         foreach ($mapIcons as $mapIcon) {
    //             $existingPoi = Poi::where('poi_id', $mapIcon['id'])->first();
    //             if ($existingPoi) {
    //                 if($existingPoi['updated_at'] != $mapIcon['updated_at']){
    //                     $data = [
    //                         'poi_id' => $mapIcon['id'],
    //                         'regaykar_user_id' => $user->id,
    //                         'map_icon_id' => $mapIcon['map_icon_id'],
    //                         'name' => $mapIcon['name'],
    //                         'description' => $mapIcon['description'],
    //                         'coordinates' => $mapIcon['coordinates'],
    //                         'active' => $mapIcon['active'],
    //                         'created_at' => $mapIcon['created_at'],
    //                         'updated_at' => $mapIcon['updated_at']
    //                     ];
    //                     $existingPoi->update($data);
    //                 }
    //             } else {
    //                 Poi::create([
    //                     'poi_id' => $mapIcon['id'],
    //                     'regaykar_user_id' => $user->id,
    //                     'map_icon_id' => $mapIcon['map_icon_id'],
    //                     'name' => $mapIcon['name'],
    //                     'description' => $mapIcon['description'],
    //                     'coordinates' => $mapIcon['coordinates'],
    //                     'active' => $mapIcon['active'],
    //                     'status' => 'approved',
    //                     'created_at' => $mapIcon['created_at'],
    //                     'updated_at' => $mapIcon['updated_at'],
    //                 ]);
    //             }
    //         }
    //     }
    // }

    public function syncData()
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role != "user") {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }
            $user = User::with('server')->find($user->id);
            $masterPortsResponse = Http::get($user->server->server_url . '/api/get_user_map_icons', [
                'lang' => 'en',
                'user_api_hash' => $user->api_key,
            ]);
            $mapIcons = $masterPortsResponse->json()['items']['mapIcons'] ?? [];
            foreach ($mapIcons as $mapIcon) {
                $existingPoi = Poi::where('poi_id', $mapIcon['id'])->first();
                if ($existingPoi) {
                    if($existingPoi['updated_at'] != $mapIcon['updated_at']){
                        $data = [
                            'poi_id' => $mapIcon['id'],
                            'regaykar_user_id' => $user->id,
                            'map_icon_id' => $mapIcon['map_icon_id'],
                            'name' => $mapIcon['name'],
                            'description' => $mapIcon['description'],
                            'coordinates' => $mapIcon['coordinates'],
                            'active' => $mapIcon['active'],
                            'created_at' => $mapIcon['created_at'],
                            'updated_at' => $mapIcon['updated_at']
                        ];
                        $existingPoi->update($data);
                    }
                } else {
                    Poi::create([
                        'poi_id' => $mapIcon['id'],
                        'regaykar_user_id' => $user->id,
                        'map_icon_id' => $mapIcon['map_icon_id'],
                        'name' => $mapIcon['name'],
                        'description' => $mapIcon['description'],
                        'coordinates' => $mapIcon['coordinates'],
                        'active' => $mapIcon['active'],
                        'status' => 'approved',
                        'created_at' => $mapIcon['created_at'],
                        'updated_at' => $mapIcon['updated_at'],
                    ]);
                }
            }
            return response()->json([
                'status' => true,
                'message' => 'Data sync Successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while fetching POIs: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updatePoiStatus(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }
            $Server = Servers::find($user->server_id);
            $validator = Validator::make($request->all(), [
                'status' => 'required|string',
                'poi_id' => 'required|numeric'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }
            $input = $request->all();

            $poi = Poi::find($input['poi_id']);
            if(!$poi){
                return response()->json([
                    'status' => false,
                    'message' => "Poi not found!",
                ], 400);
            }
            if($input['status'] === 'approved'){
                $poi->update(['status' => "approved", "active" => 1]);
                $url = $Server->server_url.'/api/add_map_icon?lang=en&user_api_hash='.$user->api_key;
                $response = Http::accept('application/json')
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($url, $poi);
                $CreatemapIcons = $response->json() ?? [];

                if($CreatemapIcons['status'] && $CreatemapIcons['status'] == 1){

                    $mapIconsResponse = Http::get($Server->server_url . '/api/get_user_map_icons', [
                        'lang' => 'en',
                        'user_api_hash' => $user->api_key,
                    ]);
                    $mapIcons = $mapIconsResponse->json()['items']['mapIcons'] ?? [];
                    $filteredData = end($mapIcons);
                    if($filteredData){
                        $poi->update(['created_at' => $filteredData['created_at'], 'updated_at' => $filteredData['updated_at'], 'poi_id' => $filteredData['id']]);
                        return response()->json([
                            'status' => true,
                            'message' => "Poi updated successfully"
                        ], 200);
                    }
                }else{
                    return response()->json([
                        'status' => false,
                        'message' => "Try again",
                    ], 400);
                }
                print_r($mapIcons);exit;
            }else if($input['status'] === 'reject'){
                $poi->update(['status' => "reject"]);
            }
            return response()->json([
                'status' => true,
                'message' => "Poi updated successfully"
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while fetching POIs: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    public function getPoisOptions()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User is not authenticated.',
            ], 401);
        }
        $userId = $user->id;
        $Poi = Poi::select('id','name')->where('regaykar_user_id', $userId)->get();
        return response()->json([
            'status' => true,
            'message' => 'Poi records fetched successfully!',
            'data' => $Poi,
        ], 200);
    }
}
