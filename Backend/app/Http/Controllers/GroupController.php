<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
        $startDate = Carbon::parse($request->input('startDate'))->toDateString();
        $endDate = Carbon::parse($request->input('endDate'))->toDateString();
        $group = Group::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Group created successfully!',
            'data' => $group,
        ], 201);
    }

    // Get all groups
    public function index()
    {
        $groups = Group::all();

        return response()->json($groups);
    }
}
