<?php

namespace App\Http\Controllers;

use App\Models\SalesModel;
use App\Models\AssigendServer;
use App\Models\User;
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
            'user_id' => 'required|numeric|max:255',
            'name' => 'required|string|max:255',
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
    public function getObjects(Request $request){

        $userId = $request->input('user_id');
        if(!$userId){
            return response()->json([
                'status' => false,
                'message' => 'Regaykar user id is required',
            ], 401);
        }
        $saleData = SalesModel::where('user_id', $userId)->get();
        return response()->json([
            'status' => true,
            'message' => 'Sales records fetched successfully!',
            'data' => $saleData,
        ], 200);
    }
    public function updateObject(Request $request)
    {

        $input = $request->all();
        $validator = Validator::make($input, [
            'id' => 'required|numeric',
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'password' => 'nullable|string|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        try {
            $object = SalesModel::find($input['id']);
            if(!$object){
                return response()->json([
                    'status' => false,
                    'message' => 'User not found',
                    'data' => $object,
                ], status: 400);
            }
            $object->name = $input['name'];
            $object->user_id = $input['user_id'];
            $object->username = $input['username'];
            if (!empty($input['password'])) {
                $object->password = Hash::make($input['password']);
            }
            $object->save();
            return response()->json([
                'status' => true,
                'message' => 'Object updated successfully!',
                'data' => $object,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while Object updated!.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function deleteObject(Request $request, $id){
        try {
            $sales = SalesModel::find($id);
            if (!$sales) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found.',
                ], 404);
            }
            $sales->save();
            $sales->delete();
            return response()->json([
                'status' => true,
                'message' => 'Object deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the object.',
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

    public function getsalesObjects(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User is not authenticated.',
            ], 401);
        }
        $userId = $user->id;
        $saleData = SalesModel::where('user_id', $userId)->with(['groups.group'])->get();
        return response()->json([
            'status' => true,
            'message' => 'Sales records fetched successfully!',
            'data' => $saleData,
        ], 200);
    }

    public function getObjectsList()
    {
        $saleData = SalesModel::with(['user' => function($query) {
            $query->select('id', 'username');
        }])->get();
        return response()->json([
            'status' => true,
            'message' => 'Sales records fetched successfully!',
            'data' => $saleData,
        ], 200);
    }

    public function getAdminObjectsList()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }
        $serverIds = AssigendServer::where('user_id', $user->id)->pluck('server_id')->toArray();
        $users = User::where('server_id', $serverIds)->where('role', 'user')->pluck('id')->toArray();
        $saleData = SalesModel::with(['user' => function($query) {
            $query->select('id', 'username');
        }])->WhereIn('user_id', $users)->get();
        return response()->json([
            'status' => true,
            'message' => 'Sales records fetched successfully!',
            'data' => $saleData,
        ], 200);
    }
}
