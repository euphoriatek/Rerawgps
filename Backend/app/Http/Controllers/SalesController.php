<?php

namespace App\Http\Controllers;

use App\Models\SalesModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class SalesController extends Controller
{
    // Store method with validation
    public function store(Request $request)
    {

        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string|max:255',
            'user_id' => 'required|numeric|max:255',
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        try {
            $input['password'] = Hash::make($input['password']);
            $object = SalesModel::create($input);
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

    public function login(Request $request)
    {
        $input = $request->all();
        // Validate input
        $validator = Validator::make($input, [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        $sales = SalesModel::where('username', $request->username)->first();
        if (!$sales || !Hash::check($request->password, $sales->password)) {
            return response()->json(['status' => false, 'message' => 'Invalid credentials'], 401);
        }
        // $token = $sales->createSalesToken('sales_token');
        $token = $sales->createToken('sales_token')->plainTextToken;
        $sales->remember_token = $token;
        $sales->save();
        return response()->json([
            'status' => true,
            'message' => 'Login successful!',
            'token' => $token,
        ], 200);
    }
}
