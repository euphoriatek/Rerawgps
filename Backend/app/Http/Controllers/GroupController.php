<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\AssignedPoi;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    public function store(Request $request)
    {
        $input = $request->all();

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'startDate' => 'required|date',
            'pois_id' => 'required|array',
            'pois_id.*' => 'exists:pois,id',
            'sale_agent_id' => 'required|exists:sales,id',
        ]);
        $userId = $request->input('user_id');
        $startDate = Carbon::parse($request->input('startDate'))->toDateString();
        $saleAgentId = $request->input('sale_agent_id');  
        $group = Group::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'start_date' => $startDate,
            'user_id' => $userId,
            'sale_agent_id' => $saleAgentId, 
        ]);

        if ($group) {
            $poisIds = $request->input('pois_id');
            foreach ($poisIds as $poiId) {
                AssignedPoi::create([
                    'group_id' => $group->id,
                    'pois_id' => $poiId,
                    'sale_agent_id' =>$saleAgentId
                ]);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Group created successfully!',
            'data' => $group,
        ], 201);
    }

    public function getGroupUserList()
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
            $groups = Group::where('user_id', $user->id)->with('assignedPois', 'salesAgent')->get();
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
            $group->update([
                'name' => $input['name'],
                'description' => $input['description'],
                'sale_agent_id' => $group->sale_agent_id
            ]);
            AssignedPoi::where('group_id', $group->id)->delete();
            foreach ($input['pois_id'] as $poiId) {
                AssignedPoi::create([
                    'group_id' => $group->id,
                    'pois_id' => $poiId,
                    'sale_agent_id' => $group->sale_agent_id
                ]);
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


}