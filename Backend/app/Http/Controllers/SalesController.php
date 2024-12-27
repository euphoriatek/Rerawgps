<?php

namespace App\Http\Controllers;

use App\Models\SalesModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class SalesController extends Controller
{
    // Store method with validation
    public function store(Request $request)
    {

        $input = $request->all();
        $validator = Validator::make($input, [
            'imei' => 'required|regex:/^[0-9]{15}$/',
            'name' => 'required|string|max:255',
            'user_id' => 'required|string|max:255',
            'expire' => 'nullable',
            'expire_date' => 'nullable|date',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        try {

            $object = $this->createUser($input);
            return response()->json([
                'status' => true,
                'message' => 'Object added successfully!',
                'data' => $object,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while Object added!.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function createUser($data)
    {

        $object = SalesModel::create([
            'imei' => $data['imei'],
            'name' => $data['name'],
            'user' => $data['user'],
            'expire' => $data['expire'],
            'expire_date' => $data['expire_date'] ?? null,
        ]);
        return $object;
    }
    public function getObjectList(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }
            $objects = SalesModel::where('user_id', $user->id)->get();
            return response()->json([
                'status' => true,
                'message' => 'Sales records fetched successfully!',
                'data' => $objects,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetching sales records.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
