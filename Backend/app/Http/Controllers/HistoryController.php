<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Poi;
use App\Models\User;
use App\Models\Servers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
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
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($item) {
                    $poisIds = json_decode($item->pois_id, true);
                    $item->pois = Poi::whereIn('id', $poisIds)->get();
                    return $item;
                });

            $serverId = $user->server_id;
            $servers = Servers::where('id', $serverId)->get();

            return response()->json([
                'status' => true,
                'message' => 'plans records fetched successfully!',
                // 'data' => $history,
                'data' => [
                    'history' => $history,
                    'servers' => $servers,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch plans records.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function syncDevice()
    {
        $user = auth()->user();
        if (!$user || $user->role != "user") {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }
        $user = User::with('server')->find($user->id);
        $ReportsResponse = Http::get($user->server->server_url . '/api/get_devices', [
            'lang' => 'en',
            'user_api_hash' => $user->api_key,
        ]);
        $devices = $ReportsResponse->json();
        return response()->json([
            'status' => true,
            'data' => $devices,
        ], 200);

    }
    public function getGenerateReports(Request $request)
    {
        $user = auth()->user();
        if (!$user || $user->role != "user") {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }

        $input = $request->all();

        $validator = Validator::make($input, [
            'devices' => 'required|array',
            'date_from' => 'required',
            'date_to' => 'required',
            'pois' => 'required|array',
            // 'distance_tolerance'=>'required|numeric'
            'language' => 'nullable|in:en,ar,ku-so,ku-ku',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        $language = $input['language'] ?? 'en';
        \App::setLocale($language); 
        $visit_poi = [];
        $unvisited_poi = [];
        $user = User::with('server')->find($user->id);
        $pois = $input['pois'] ?? [];
        foreach ($pois as $poi) {
            $params = [
                'title' => 'Report Generate',
                'type' => 54,
                'date_from' => $input['date_from'],
                'date_to' => $input['date_to'],
                'from_time' => "00:00",
                "to_time" => "23:59",
                'format' => 'json',
                'devices' => $input['devices'],
                'stop_duration' => 4,
                'distance_tolerance' => 20,
                // 'distance_tolerance' => $input['distance_tolerance'],
                'pois' => [$poi['poi_id']]
            ];

            $apiEndPoint = $user->server->server_url . '/api/generate_report?lang=en&user_api_hash=' . $user->api_key . '&generate=1';
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($apiEndPoint, $params);

            $reports = $response->json();

            if (!empty($reports['items'][0])) {
                $table = $reports['items'][0];
                if (isset($table['table']['rows']) && count($table['table']['rows']) > 0) {
                    $row_data = $table['table']['rows'];

                    $data = [
                        "name" => $poi['name'],
                        "poi_id" => $poi['poi_id'],
                        "row" => $row_data
                    ];
                    array_push($visit_poi, $data);
                    unset($unvisited_poi[$poi['poi_id']]);
                } else {
                    array_push($unvisited_poi, $poi);
                }
            } else {
                array_push($unvisited_poi, $poi);
            }
        }
        $htmlContent = view('report', ['visit_poi' => $visit_poi, 'unvisited_poi' => $unvisited_poi, 'selectedDeviceNames' => $input['selectedDeviceNames'], 'date_from' => $input['date_from'], 'date_to' => $input['date_to'], 'from_time' => $input['from_time'] ?? '00:00', 'to_time' => $input['to_time'] ?? '23:59'])->render();
        return response()->json([
            'status' => true,
            'data' => $htmlContent,
        ]);
    }

    public function generateReports(Request $request)
    {
        $user = auth()->user();
        if (!$user || $user->role != "user") {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }
        $input = $request->all();
    
        $validator = Validator::make($input, [
            'devices' => 'required|array',
            'pois' => 'required|array',
            'distance_tolerance' => 'required|numeric',
            'language' => 'nullable|in:en,ar,ku-so,ku-ku',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        $language = $input['language'] ?? 'en';
        \App::setLocale($language); 
        $visit_poi = [];
        $unvisited_poi = [];
        $user = User::with('server')->find($user->id);
        $date_from = Carbon::parse($request->input('date_from'))->toDateString();
        $date_to = Carbon::parse($request->input('date_to'))->toDateString();
        // $params = [
        //     'title' => $input['title'],
        //     // 'type' => $input['type'],
        //     'type' => 54,
        //     'date_from' => $date_from,
        //     'date_to' => $date_to,
        //     'from_time' => $input['from_time'] ?? '00:00',
        //     'to_time' => $input['to_time'] ?? '23:59',
        //     'format' => 'json',
        //     'devices' => $input['devices'],
        //     'stop_duration' => 4,
        //     'distance_tolerance' => $input['distance_tolerance'],
        //     'pois' => $input['pois']
        // ];
      
        // $apiEndPoint = $user->server->server_url . '/api/generate_report?lang=en&user_api_hash=' . $user->api_key . '&generate=1';
        // $response = Http::withHeaders([
        //     'Accept' => 'application/json',
        //     'Content-Type' => 'application/json',
        // ])->post($apiEndPoint, $params);

        // $reports = $response->json();

        $pois = $input['pois'] ?? [];
        foreach ($pois as $poi) {
            $params = [
                'title' => 'Report Generate',
                'type' => 54,
                'date_from' => $date_from,
                'date_to' => $date_to,
                'from_time' => $input['from_time'] ?? '00:00',
                'to_time' => $input['to_time'] ?? '23:59',
                'format' => 'json',
                'devices' => $input['devices'],
                'stop_duration' => $input['stop_duration'] ?? 4,
                'distance_tolerance' => 20,
                // 'distance_tolerance' => $input['distance_tolerance'],
                'pois' => [$poi['poi_id']]
            ];

            $apiEndPoint = $user->server->server_url . '/api/generate_report?lang=en&user_api_hash=' . $user->api_key . '&generate=1';
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($apiEndPoint, $params);

            $reports = $response->json();

            if (!empty($reports['items'][0])) {
                $table = $reports['items'][0];
                if (isset($table['table']['rows']) && count($table['table']['rows']) > 0) {
                    $row_data = $table['table']['rows'];

                    $data = [
                        "name" => $poi['name'],
                        "poi_id" => $poi['poi_id'],
                        "row" => $row_data
                    ];
                    array_push($visit_poi, $data);
                    unset($unvisited_poi[$poi['poi_id']]);
                } else {
                    array_push($unvisited_poi, $poi);
                }
            } else {
                array_push($unvisited_poi, $poi);
            }
        }
        // echo "<pre>";
        // print_r($reports);exit;
        $htmlContent = view('report', ['visit_poi' => $visit_poi, 'unvisited_poi' => $unvisited_poi, 'selectedDeviceNames' => $input['selectedDeviceNames'], 'date_from' => $input['date_from'], 'date_to' => $input['date_to'], 'from_time' => $input['from_time'] ?? '00:00', 'to_time' => $input['to_time'] ?? '23:59'])->render();
        // $htmlContent = view('reports', ['data' => $reports['items'], 'date_from' => $input['date_from'], 'date_to' => $input['date_to'], 'from_time' => $input['from_time'] ?? '00:00', 'to_time' => $input['to_time'] ?? '23:59'])->render();
        return response()->json([
            'status' => true,
            'data' => $htmlContent,
        ]);

    }

    public function getTypes()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User is not authenticated.',
                ], 401);
            }
            $user = User::with('server')->find($user->id);
         
            $masterPortsResponse = Http::get($user->server->server_url . '/api/get_reports_types', [
                'lang' => 'en',
                'user_api_hash' => $user->api_key,
            ]);
            $data = $masterPortsResponse->json();
            $dataType = collect($data['items'])->map(function($item) {
                return [
                    'type' => $item['type'],
                    'name' => $item['name'],
                ];
            });
            return response()->json([
                'status' => true,
                'data' => $dataType,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
  
}