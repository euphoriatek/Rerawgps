<?php

namespace App\Http\Controllers;

use App\Models\RegayKarPlans;
use DB;
use App\Models\AssignedPoi;
use App\Models\Group;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RegayKarPlansController extends Controller
{
    public function store(Request $request)
    {
        $input = $request->all();
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User is not authenticated.',
            ], 401);
        }
        $userId = $user->id;
        $request->validate([
            'groups_id' => 'required|array',
            'groups_id.*' => 'exists:groups,id',
            'startdate' => 'required|date',
            'sale_agent_id' => 'required|exists:sales,id',
        ]);
        $startdate = Carbon::parse($request->input('startdate'))->toDateString();
        foreach($input['groups_id'] as $data){
            $checkExiest = RegayKarPlans::where('group_id', $data)->where('sale_agent_id', $input['sale_agent_id'])->where('activation_date', $startdate)->first();
            if(!$checkExiest){
                $createPlan = RegayKarPlans::create([
                    'group_id' => $data,
                    'user_id' => $userId,
                    'activation_date' => $startdate,
                    'sale_agent_id' => $input['sale_agent_id']
                ]);
                $groupFind = Group::find($data);
                if($groupFind){
                    $group_ids = json_decode($groupFind->pois_id); 
                    foreach($group_ids as $id){
                        AssignedPoi::create([
                            'group_id' => $groupFind->id,
                            'poi_id' => $id,
                            'plan_id' => $createPlan->id
                        ]);
                    }
                }
            }
        }
        return response()->json([
            'status' => true,
            'message' => 'Plan created successfully!',
            'data' => $createPlan ?? '',
        ], 200);
    }

    public function getCurrentPlans()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User is not authenticated.',
                ], 401);
            }
            $userId = $user->id;
            $plans = RegayKarPlans::with(['group','sales'])->where('user_id', $userId)->where('status', 1)->get();
            return response()->json([
                'status' => true,
                'message' => 'plans records fetched successfully!',
                'data' => $plans,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch plans records.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updatePlan(Request $request)
    {
        $input = $request->all();

        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User is not authenticated.',
            ], 401);
        }
        $userId = $user->id;
        $validator = Validator::make($input, [
            'id' => 'required|numeric',
            'startdate' => 'required|date',
            'sale_agent_id' => 'required|exists:sales,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        try {
            $plan = RegayKarPlans::find($input['id']);
            if (!$plan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Plan record not found!',
                ], 404);
            }
            $startdate = Carbon::parse($request->input('startdate'))->toDateString();
            $plan->update([
                'user_id' => $userId,
                'activation_date' => $startdate,
                'sale_agent_id' => $input['sale_agent_id']
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Plan updated successfully!',
                'data' => $plan,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the plan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function deletePlan(Request $request, $id)
    {
        try {
            $plan = RegayKarPlans::find($id);
            if (!$plan) {
                return response()->json([
                    'status' => false,
                    'message' => 'plan Records not found.',
                ], 404);
            }
            $plan->delete();
            return response()->json([
                'status' => true,
                'message' => 'plan records deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the plan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    


}