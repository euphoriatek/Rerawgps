<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use App\Models\Poi;
use App\Models\User;
use App\Models\Servers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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
        ]);

    }

    public function gerGenerateReports(Request $request)
    {

        $user = auth()->user();
        if (!$user || $user->role != "user") {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }
        $user = User::with('server')->find($user->id);
        $pois = $request->input('data.pois', []);
        $poiIds = array_map(function ($poi) {
            return $poi['poi_id'] ?? null;
        }, $pois);
        $params = [
            'title' => $request->input('data.title'),
            'type' => $request->input('data.type'),
            // 'date_from' => '2025-01-22',
            'date_from' => $request->input('data.date_from'),
            // 'date_to' => '2025-02-24',
            'date_to' => $request->input('data.date_to'),
            'format' => 'json',
            'devices' => $request->input('data.devices'),
            'stop_duration' => $request->input('data.stop_duration'),
            'distance_tolerance' => $request->input('data.distance_tolerance'),
            'pois' => $poiIds
        ];
        $apiEndPoint = $user->server->server_url . '/api/generate_report?lang=en&user_api_hash=' . $user->api_key . '&generate=1';
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])
            ->post($apiEndPoint, $params);
        $reports = $response->json();

        return response()->json([
            'status' => true,
            'data' => $reports['items'] ?? [],
        ]);
    }
    public function syncHistory()
    {
        $user = auth()->user();
        if (!$user || $user->role != "user") {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }
        $user = User::with('server')->find($user->id);
        $payload = [
            'lang' => 'en',
            'user_api_hash' => $user->api_key,
            'device_id' => 2869,
            'from_date' => '2025-02-12',
            'to_date' => '2025-02-14',
            'from_time' => '00:00',
            'to_time' => '23:59'
        ];
        $ReportsResponse = Http::post($user->server->server_url . '/api/get_history', $payload);
        $history = $ReportsResponse->json();

        return response()->json([
            'status' => true,
            'data' => $history,
        ]);
    }

}
