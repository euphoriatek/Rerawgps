<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AssigendServer;
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
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'mobile_number' => $data['mobile_number'],
            'address' => $data['address'],
            'api_key' => $data['api_key'],

        ]);

        return $user;
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
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }

            // if (Auth::attempt(['username' => $request->username, 'password' => $request->password, 'role' => 'admin'])) {
            //     $user = Auth::user();
            //     $token = $user->createToken('remember_token')->plainTextToken;
            //     $user->remember_token = $token;
            //     $user->save();
            //     $user->token = $token;
            //     return response()->json([
            //         'status' => true,
            //         'message' => 'Logged in Successfully!',
            //         'data' => $user,

            //     ], 200);
            // }
            if (Auth::attempt(['username' => $request->username, 'password' => $request->password]) && 
                in_array(Auth::user()->role, ['admin', 'superadmin'])) {
                $user = Auth::user();
                $token = $user->createToken('remember_token')->plainTextToken;
                $user->remember_token = $token;
                $user->save();
                $user->token = $token;
                return response()->json([
                    'status' => true,
                    'message' => 'Logged in Successfully!',
                    'data' => $user,
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

    public function userLogin(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'password' => 'required|string',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 400);
            }
            if (Auth::attempt(['username' => $request->username, 'password' => $request->password, 'role' => 'user'])) {
                $user = Auth::user();
                $token = $user->createToken('remember_token')->plainTextToken;
                $user->remember_token = $token;
                $user->save();
                $user->token = $token;
                return response()->json([
                    'status' => true,
                    'message' => 'User Logged in Successfully!',
                    'data' => $user,
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

    public function UsersList()
    {
        try {
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

    public function Users()
    {
        try {
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

    public function addAdmin(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required|string|max:255',
            'server_id.*' => 'required|distinct|unique:assigned_servers,server_id',
            // 'server_id' => 'required|array',
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $input['role'] = "admin";
            $input['password'] = Hash::make($input['password']);
            $user = User::create($input);

            foreach ($input['server_id'] as $key => $value) {
                $AssigendServer = AssigendServer::create(['user_id' => $user->id, 'server_id' => $value]);
            }
            
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

    public function getAdmin(){
        try {

            $servers = User::with('assigned_servers.server')->where('role', 'admin')->get();
            return response()->json([
                'status' => true,
                'data' => $servers,
                'message' => 'Success'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching users.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
