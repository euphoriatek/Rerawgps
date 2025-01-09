<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    // Store the group data
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
        ]);
        $userId = $request->input('created_by');
        $startDate = Carbon::parse($request->input('startDate'))->toDateString();
        $endDate = Carbon::parse($request->input('endDate'))->toDateString();
        $group = Group::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'created_by' => $userId
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Group created successfully!',
            'data' => $group,
        ], 201);
    }
    public function getGroupUserList()
    {
        try {
            $groups = Group::get();
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
        $validator = Validator::make($input, [
            'id' => 'required|exists:groups,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string'
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
                    'message' => 'Group rRecord not found'
                ], 404);
            }
            $group->name = $input['name'];
            $group->description = $input['description'];
            $group->save();
            return response()->json([
                'status' => true,
                'message' => 'Groups Record updated successfully!',
                'data' => $group,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while Group updated!.',
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