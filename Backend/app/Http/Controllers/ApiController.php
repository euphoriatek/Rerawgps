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
        $input = $request->all();

        $validator = Validator::make($input, [
            'site_url' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'api_key' => 'required',
            'mobile_number' => 'required|numeric|min:10',
            'password' => 'required|string|min:8',
            'address' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $user = $this->createUser($input);

            return response()->json([
                'status' => true,
                'message' => 'User added successfully!',
                'data' => $user,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while registering the user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function createUser($data)
    {
        $user = User::create([
            'site_url' => $data['site_url'],
            'mobile_number' => $data['mobile_number'],
            'password' => Hash::make($data['password']),
            'username' => $data['username'],
            'api_key' => $data['api_key'],
            'address' => $data['address'],
        ]);
        return $user;
    }
    //login 

    public function login(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }

            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $user = Auth::user();
                $token = $user->createToken('remember_token')->plainTextToken;
                $user->remember_token = $token;
                $user->save();
                return response()->json([
                    'status' => true,
                    'message' => 'Logged in Successfully!',
                    'data' => $user,
                    'token' => $token,
                ], 200);
            }

            return response()->json([
                'status' => false,
                'message' => 'Invalid username and Password!',
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

            // $request->user()->tokens->each(function ($token) {
            //     $token->delete();
            // });

            return response()->json([
                'status' => true,
                'message' => 'success'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while logging out.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function UsersList(){
        try{
            $users = User::where('role', 'user')->get();
            return response()->json([
                'status' => true,
                'data' => $users,
                'message' => 'Success'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while logging out.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function Users(){
        try{
            $users = User::select('id', 'username')->where('role', 'user')->get();
            return response()->json([
                'status' => true,
                'data' => $users,
                'message' => 'Success'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while logging out.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
