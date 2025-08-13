<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\AssignedPoi;
use App\Models\RegayKarPlans;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
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
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'pois_id' => 'required|array',
            'pois_id.*' => 'exists:pois,id',
        ]);
        $group = Group::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'user_id' => $userId,
            'pois_id' => json_encode($request->input('pois_id'))
        ]);
        foreach ($request->input('pois_id') as $poiId) {
            AssignedPoi::create([
                'group_id' => $group->id,
                'poi_id' => $poiId
            ]);
        }
        return response()->json([
            'status' => true,
            'message' => 'Group created successfully!',
            'data' => $group,
        ], 201);
    }

    public function getGroupList()
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
            $groups = Group::with('assignedPois.poi')->where('user_id', $userId)->whereNull('deleted_at')->orderBy('created_at', 'desc')->get();
            return response()->json([
                'status' => true,
                'message' => 'Groups records fetched successfully!',
                'data' => $groups,
            ], 200);
           
            return response()->json([
                'status' => true,
                'message' => 'Groups records fetched successfully!',
                'data' => $groups,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch groups records.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function editGroup(Request $request)
    {
        $input = $request->all();

        // Validation rules
        $validator = Validator::make($input, [
            'id' => 'required|numeric',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'pois_id.*' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        try {
            $group = Group::find($input['id']);
            if (!$group) {
                return response()->json([
                    'status' => false,
                    'message' => 'Group record not found!',
                ], 404);
            }
            $startdate = Carbon::parse($request->input('startdate'))->toDateString();
            $group->update([
                'name' => $input['name'],
                'description' => $input['description']
            ]);
            if($group){
                $delete = AssignedPoi::where('group_id', $group->id)->delete();
                foreach ($request->input('pois_id') as $poiId) {
                    AssignedPoi::create([
                        'group_id' => $group->id,
                        'poi_id' => $poiId
                    ]);
                }
            }
            return response()->json([
                'status' => true,
                'message' => 'Group updated successfully!',
                'data' => $group,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the group.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function deleteGroupUser(Request $request, $id)
    {
        try {
            $group = Group::find($id);
            if (!$group) {
                return response()->json([
                    'status' => false,
                    'message' => 'Groups Records not found.',
                ], 404);
            }
            $group->delete();
            $plans = RegayKarPlans::where('group_id', $id)->get();
            if($plans){
                foreach ($plans as $plan) {
                    $plan->delete();
                }
            }
            return response()->json([
                'status' => true,
                'message' => 'Groups records deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the group.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkPlans(Request $request, $id)
    {
        $group = Group::find($id);

        if (!$group) {
            return response()->json([
                'status' => false,
                'message' => 'Group record not found.',
            ], 404);
        }

        $hasActivePlans = RegayKarPlans::where('group_id', $id)->exists();

        return response()->json([
            'status' => $hasActivePlans,
        ], 200);
    }
    
    public function getGroupOptions()
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
            $groups = Group::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
            return response()->json([
                'status' => true,
                'message' => 'Groups records fetched successfully!',
                'data' => $groups,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch groups records.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}