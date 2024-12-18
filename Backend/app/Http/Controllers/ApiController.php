<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class ApiController extends Controller
{
    /**
     * Register a new user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[0-9]/',
            ],
        ], [
            'password.regex' => 'The password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'password.min' => 'The password must be at least 8 characters long.',
            'password.confirmed' => 'The password confirmation does not match.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'message' => 'User successfully registered!',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while registering the user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    //login 
    public function login(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'password' => 'required|string',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors(),
                ], 400);
            }

            if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
                $user = Auth::user();
                return response()->json([
                    'message' => 'Login successful!',
                    'user' => $user,
                ], 200);
            }
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
  
        } catch (\Exception $e) {
    
            return response()->json([
                'message' => 'An error occurred. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function logout(Request $request)
    {
        try {
            // Log the user out
            Auth::logout();

            // Optionally invalidate the user's tokens if using token-based authentication
            // $request->user()->tokens->each(function ($token) {
            //     $token->delete();
            // });

            return response()->json([
                'message' => 'Successfully logged out.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while logging out.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    



}
