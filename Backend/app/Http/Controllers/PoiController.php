<?php
namespace App\Http\Controllers;

use App\Models\Poi;
use App\Models\User;
use App\Models\Servers;
use App\Models\SalesModel;
use App\Models\AssignedPoi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
class PoiController extends Controller
{
    public function store(Request $request)
    {
        $salesUser = Auth::guard('sales')->user();
        $salesId = $salesUser->id;
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'description' => 'nullable|string',
                'coordinates.lat' => 'required|numeric|min:-90|max:90',
                'coordinates.lng' => 'required|numeric|min:-180|max:180',
                'map_icon_id' => 'required|integer',
                'regaykar_user_id' => 'required|numeric',
                'group_id' => 'nullable|numeric',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }
            $input = $request->all();
            $input['coordinates'] = json_encode($input['coordinates']);
            $input['sales_agent_id'] = $salesId;
            
            $poi = Poi::create($input);

            return response()->json([
                'status' => true,
                'message' => 'Poi added successfully!',
                'data' => $poi,
            ], 200);
        } catch (\Exception $e) {
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
                'description' => 'required|string',
                // 'group_id' =>'required|numeric',
                // 'group_name' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }
            $input = $request->all();
            $poi = Poi::find($input['id']);
            $poi->update($input);
            // $poi->update(['name' => $input['name'], 'description' => $input['description'], 'group_id' => $input['group_id'],'group_name' => $input['group_name'],]);
            if(isset($input['groupId'])){
                $assignedPoi = AssignedPoi::updateOrCreate(
                    ['poi_id' => $poi->id],
                    ['group_id' => $input['groupId']]
                );
            }
            return response()->json([
                'status' => true,
                'message' => 'Poi updated successfully!',
                'data' => $poi,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
    // public function getPendingPois()
    // {
    //     try {
    //         $user = auth()->user();
    //         if (!$user) {
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Unauthorized. Please log in.',
    //             ], 401);
    //         }

    //         $pendingPois = Poi::where('regaykar_user_id', $user->id)->where('status', 'pending')->orderBy('created_at', 'desc')->get()
    //                           ->map(function ($poi) {
    //                               $sales = SalesModel::find($poi->sales_agent_id);
    //                               $poi->sales_agent_name = $sales ? $sales->username : null;
    //                               return $poi;
    //                           });
    
    //         return response()->json([
    //             'status' => true,
    //             'data' => $pendingPois
    //         ], 200);
    
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Error: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }
    
    public function getPendingPois()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }
    
            // Fetch pending POIs and count them
            $pendingPoisQuery = Poi::with('pendingGroups')->where('regaykar_user_id', $user->id)
                ->where('status', 'pending');
    
            $totalPendingPois = $pendingPoisQuery->count();
    
            $pendingPois = $pendingPoisQuery
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($poi) {
                    $sales = SalesModel::find($poi->sales_agent_id);
                    $poi->sales_agent_name = $sales ? $sales->username : null;
                    return $poi;
                });
    
            return response()->json([
                'status' => true,
                'pending_pois_count' => $totalPendingPois,
                'data' => $pendingPois
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    public function getPois(Request $request)
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }
            $input = $request->all();
            if($input && isset($input['server_grpid'])){
                $pois = Poi::where('regaykar_user_id', $user->id)->where('group_id', $input['server_grpid'])->where('status', 'approved')->whereNull('deleted_at')->with('groups.group')->orderBy('created_at', 'desc')->get();
            }else if($input && isset($input['group_id'])){
                $pois = Poi::whereHas('groups', function ($query) use ($request) {
                    $query->where('group_id', $request->group_id); // or just $group_id if passed directly
                })
                ->where('regaykar_user_id', $user->id)
                ->where('status', 'approved')
                ->whereNull('deleted_at')
                ->with('groups.group') // eager load groups if needed
                ->orderBy('created_at', 'desc')
                ->get();
            }else{
                $pois = Poi::where('regaykar_user_id', $user->id)->where('status', 'approved')->whereNull('deleted_at')->with('groups.group')->orderBy('created_at', 'desc')->get();
            }
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

    public function syncData()
    {
        try {
            $user = auth()->user();
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
            $groupResponse = Http::get($user->server->server_url . '/api/pois_groups', [
                'lang' => 'en',
                'user_api_hash' => $user->api_key,
            ]);
            $groups = $groupResponse->json() ?? [];
            $allPois = Poi::where('regaykar_user_id', $user->id)->get();
            $existingPoiIds = [];
            foreach ($mapIcons as $mapIcon) {
                $group_id = isset($mapIcon['group_id']) ? $mapIcon['group_id'] : 0;
                $groupTitle = null;
                foreach ($groups as $group) {
                    if (isset($group['id']) && $group['id'] == $group_id) {
                        $groupTitle = $group['title'];
                        break;
                    }
                }
                if (!isset($mapIcon['id'])) {
                    continue;
                }
                $existingPoi = Poi::where('poi_id',$mapIcon['id'])->first();
                $existingPoiIds[] = $mapIcon['id'];
                if ($existingPoi) {
                    if ($existingPoi['updated_at'] != $mapIcon['updated_at']) {
                        $data = [
                            'poi_id' => $mapIcon['id'],
                            'regaykar_user_id' => $user->id,
                            'map_icon_id' => $mapIcon['map_icon_id'],
                            'group_id' => $group_id,
                            'group_name' => $groupTitle,
                            'name' => $mapIcon['name'],
                            'description' => $mapIcon['description'],
                            'coordinates' => $mapIcon['coordinates'],
                            'active' => $mapIcon['active'],
                            'created_at' => $mapIcon['created_at'],
                            'updated_at' => $mapIcon['updated_at'],
                        ];
                        $existingPoi->update($data);
                    }
                } else {
                    Poi::create([
                        'poi_id' => $mapIcon['id'],
                        'regaykar_user_id' => $user->id,
                        'map_icon_id' => $mapIcon['map_icon_id'],
                        'group_id' => $group_id,
                        'group_name' => $groupTitle,
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
            foreach($allPois as $poi) {
                if (!in_array($poi->poi_id, $existingPoiIds)) {
                    $poi->deleted_at = now();
                    $poi->save();
                }
            }
            return response()->json([
                'status' => true,
                'message' => 'Data sync successfully',
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
            $user = auth()->user();
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
            if (!$poi) {
                return response()->json([
                    'status' => false,
                    'message' => "Poi not found!",
                ], 400);
            }
            if ($input['status'] === 'approved') {
                $mapIconId = 9;
                $poi->update(['status' => "approved", "active" => 1]);
                $url = $Server->server_url . '/api/add_map_icon?lang=en&user_api_hash=' . $user->api_key;
           
                $response = Http::accept('application/json')
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                    ])
                    ->post($url, array_merge($poi->toArray(), ['map_icon_id' => $mapIconId]));
                $CreatemapIcons = $response->json() ?? [];
    
                if ($CreatemapIcons['status'] && $CreatemapIcons['status'] == 1) {

                    $mapIconsResponse = Http::get($Server->server_url . '/api/get_user_map_icons', [
                        'lang' => 'en',
                        'user_api_hash' => $user->api_key,
                    ]);
                    $mapIcons = $mapIconsResponse->json()['items']['mapIcons'] ?? [];
                    $filteredData = end($mapIcons);
                    if ($filteredData) {
                        $poi->update(['created_at' => $filteredData['created_at'], 'updated_at' => $filteredData['updated_at'], 'poi_id' => $filteredData['id']]);
                        return response()->json([
                            'status' => true,
                            'message' => "Poi updated successfully"
                        ], 200);
                    }
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => "Try again",
                    ], 400);
                }
            } else if ($input['status'] === 'reject') {
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
        $Poi = Poi::select('id', 'name')->where('regaykar_user_id', $userId)->get();
        return response()->json([
            'status' => true,
            'message' => 'Poi records fetched successfully!',
            'data' => $Poi,
        ], 200);
    }
}
