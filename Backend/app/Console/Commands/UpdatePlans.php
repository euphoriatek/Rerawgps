<?php

namespace App\Console\Commands;
use App\Models\History;
use App\Models\RegayKarPlans;
use App\Models\AssignedPoi;
use Carbon\Carbon;
use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class UpdatePlans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Plans Status';

    public function handle()
    {
        $today = Carbon::now()->toDateString();

        $plans = RegayKarPlans::where('activation_date', '<', $today)
            ->where('status', 1)
            ->get();

        foreach ($plans as $plan) {
            $findPlan = RegayKarPlans::find($plan->id);
            $poiRecords = AssignedPoi::with('poi')->where('group_id', $findPlan->group_id)->get();

            $poiIDs = $poiRecords->pluck('poi_id')->toArray();

            $findPlan->update(['status' => 0]);

            $history = History::create([
                'group_id' => $findPlan->group_id,
                'sale_agent_id' => $findPlan->sale_agent_id,
                'pois_id' => json_encode($poiIDs),
                'plan_id' => $plan->id,
                'user_id' => $plan->user_id,
                'activation_date' => $plan->activation_date,
                'device_id' => $plan->device_id,
                'device_name' => $plan->device_name
            ]);

            $user = User::with('server')->find($plan->user_id);
            $visit_poi = [];
            $unvisited_poi = [];

            foreach ($poiRecords as $poiRecord) {
                $poiID = $poiRecord->poi->poi_id; 
                $params = [
                    'title' => 'Report Generate',
                    'type' => 54,
                    'date_from' => $plan->activation_date,
                    'date_to' => $plan->activation_date,
                    'from_time' => '00:00',
                    'to_time' => '23:59',
                    'format' => 'json',
                    'devices' => [$plan->device_id],
                    'stop_duration' => 4,
                    'distance_tolerance' => 20,
                    'pois' => [$poiID]
                ];

                $apiEndPoint = $user->server->server_url . '/api/generate_report?lang=en&user_api_hash=' . $user->api_key . '&generate=1';

                $response = Http::withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json'
                ])->post($apiEndPoint, $params);

                $report = $response->json();

                if (!empty($report['items'][0]['table']['rows'])) {
                    $visit_poi[] = [
                        'poi_id' => $poiID,
                        'name' => $poiRecord->poi->name ?? 'N/A',
                        'coordinates' => $poiRecord->poi->coordinates ?? 'N/A',
                        'row' => $report['items'][0]['table']['rows']
                    ];
                } else {
                    $unvisited_poi[] = [
                        'poi_id' => $poiID,
                        'name' => $poiRecord->poi->name ?? 'N/A',
                        'coordinates' => $poiRecord->poi->coordinates ?? 'N/A',
                    ];
                }
            }

            $htmlContent = view('report', [
                'visit_poi' => $visit_poi,
                'unvisited_poi' => $unvisited_poi,
                'selectedDeviceNames' => [$plan->device_name],
                'date_from' => $plan->activation_date,
                'date_to' => $plan->activation_date,
                'from_time' => '00:00',
                'to_time' => '23:59'
            ])->render();

            $filename = 'report_' . $history->id . '_' . time() . '.html';
            $reportPath = 'reports/' . $filename;
            Storage::disk('public')->put($reportPath, $htmlContent);

            $history->update([
                'report_path' => $reportPath,
                'visited_count' => count($visit_poi),
                'unvisited_count' => count($unvisited_poi)
            ]);
        }

        $this->info('Updated plans and generated reports successfully.');
    }
}
