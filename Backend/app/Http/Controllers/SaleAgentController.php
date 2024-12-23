<?php

namespace App\Http\Controllers;

use App\Models\SaleAgent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SaleAgentController extends Controller
{
    public function store(Request $request)
    {
        $input = $request->all();
    
        $validator = Validator::make($input, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:sale_agents,email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422); 
        }
        try {
           
            $saleAgent = SaleAgent::create([
                'name' => $input['name'],  
                'email' => $input['email'], 
                'password' => Hash::make($input['password']),  
                'is_deleted' => false,
            ]);
        
            return response()->json([
                'status' => true,
                'message' => 'Success',
                'data' => $saleAgent
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating Sale Agent.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function getRecods(Request $request)
    {
        try {
           
            $input = $request->all();
            $email = $input['email'];
            $password =  $input['password'];
            $saleAgent = SaleAgent::where('email', $email)->first();
            $pwd = Hash::check($password, $saleAgent->password);
           
            if ($saleAgent &&  $pwd ) { 
                return response()->json([
                    'status' => true,
                    'message' => 'success',
                    'data' => $saleAgent,
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Fails, Invalid email or password.',
                ], 401);
            }
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    
}

