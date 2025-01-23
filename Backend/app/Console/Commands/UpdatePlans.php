<?php

namespace App\Console\Commands;
use App\Models\History;
use App\Models\RegayKarPlans;
use App\Models\AssignedPoi;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdatePlans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update-plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Plans Status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::now()->toDateString();
        $plans =RegayKarPlans::where('activation_date', '<', $today)->where('status',1)->get();
            if($plans){
            foreach($plans as $plan){
            $findPlan = RegayKarPlans::find($plan->id);
            $poi = AssignedPoi::where('group_id', $findPlan->group_id)->pluck('poi_id')->toArray();
            $findPlan->update([
                'status' => 1
            ]);
            $createHistory =History::create([
                'group_id' => $findPlan->group_id,
                'sale_agent_id' => $findPlan->sale_agent_id,
                'pois_id' =>json_encode($poi),
                'plan_id'=>$plan->id,
                'user_id' =>$plan->user_id
            ]);
         }
       }
        $this->info('Updated successfully.');
    }
}
