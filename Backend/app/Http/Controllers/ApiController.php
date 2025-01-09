<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Servers;
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

    public function getDashboard()
    {
        $serverCount = Servers::count();
        $adminUserCount = User::where('role', 'admin')->count();
        $userCount = User::where('role', 'user')->count();
        return response()->json([
            'status' => true,
            'serverCount' => $serverCount,
            'adminUserCount' => $adminUserCount,
            'userCount' => $userCount
        ]);
    }

    public function register(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'server_id' => 'required|numeric',
            'username' => 'required|string|max:255|unique:users,username',
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
            'server_id' => $data['server_id'],
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'mobile_number' => $data['mobile_number'],
            'address' => $data['address'],
            'api_key' => $data['api_key'],
            'created_by' => $data['created_by'] ?? null

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
                if ($user->role == 'admin' && $user->is_active == 0) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Your admin account is inactive. Please contact support.',
                    ], 200);
                }
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
                if ($user->is_active == 0) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Your account is inactive. Please contact support.',
                    ], 200);
                }
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

    public function UsersList(Request $request)
    {
        try {
            $users = User::with('server')->where('role', 'user')->get();
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
            'server_id' => 'required|array',
            'server_id.*' => 'required|integer',
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:8'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
        try {
            if (User::where('username', $input['username'])->exists()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Username already exists!',
                ], 400);
            }
            $input['role'] = "admin";
            $input['password'] = Hash::make($input['password']);
            $user = User::create([
                'name' => $input['name'],
                'username' => $input['username'],
                'password' => $input['password'],
                'role' => $input['role'],
            ]);
            foreach ($input['server_id'] as $value) {
                AssigendServer::create([
                    'user_id' => $user->id,
                    'server_id' => $value
                ]);
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
    public function UpdateAdminUser(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'id' => 'required|numeric',
            'name' => 'required|string|max:255',
            'server_id.*' => 'required',
            'username' => 'required|string|max:255',
            'password' => 'nullable|string|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json([
                    'errors' => $validator->errors(),
                ], 400);
        }
        try {
            $user = User::find($input['id']);
            if (!$user) {
                return response()->json([
                        'status' => false,
                        'message' => 'User not found!',
                ], 404);
            }
            if (!empty($input['password'])) {
                $input['password'] = Hash::make($input['password']);
            } else {
                unset($input['password']);
            }
            $user->update([
                'name' => $input['name'],
                'username' => $input['username'],
                'password' => $input['password'] ?? $user->password,
            ]);
            AssigendServer::where('user_id', $user->id)->delete();
            foreach ($input['server_id'] as $value) {
                AssigendServer::create([
                    'user_id' => $user->id,
                    'server_id' => $value
                ]);
            }
            return response()->json([
                'status' => true,
                'message' => 'User updated successfully!',
                'data' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function deleteAdminUser(Request $request)
    {
        try {
            $id = $request->input('id');
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found!',
                ], 404);
            }
            AssigendServer::where('user_id', $id)->delete();
            $user->delete();
            return response()->json([
                'status' => true,
                'message' => 'User deleted successfully!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the user.',
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
    public function UpdateUser(Request $request)
    {
        $input = $request->all();
        try {
            $user = User::find($input['id']);
            $validator = Validator::make($input, [
                'id' => 'required|numeric',
                'username' => 'required|string|max:255',
                'api_key' => 'required',
                'mobile_number' => 'required|numeric|min:10',
                'password' => 'nullable|string|min:8',
                'address' => 'required|string|max:255',
                'server_id' => 'required|numeric|max:255',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors(),
                ], 400);
            }
            if (!empty($input['password'])) {
                $input['password'] = Hash::make($input['password']);
            } else {
                unset($input['password']);
            }
            $user->update([
                'username' => $input['username'],
                'api_key' => $input['api_key'],
                'mobile_number' => $input['mobile_number'],
                'address' => $input['address'],
                'server_id' => $input['server_id'],
                'password' => $input['password'] ?? $user->password
            ]);
            return response()->json([
                'status' => true,
                'message' => 'User updated successfully!',
                'data' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function deleteUser(Request $request, $id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found.',
                ], 404);
            }
            $user->save();
            $user->delete();
            return response()->json([
                'status' => true,
                'message' => 'User deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getUserInfo(Request $request)
    {
        try {
            $userId = $request->input('user_id');
            if(!$userId){
                return response()->json([
                    'status' => false,
                    'message' => 'User id is required.',
                ], 404);
            }
            $user = User::with('server')->find($userId);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found.',
                ], 404);
            }
            return response()->json([
                'status' => true,
                'message' => 'User fetch data successfully.',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetecing data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function GetAdminUsersList(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], 401);
            }
            $users = User::with('server')->where('created_by', $user->id)->where('role', 'user')->get();
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
    
    public function updateStatus(Request $request){
        try {
        $input = $request->input('user_id');
        if($input){
            $user = User::find($input);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found.',
                ], 404);
            }
            $user->update(['is_active' => $user->is_active == 1 ? 0 : 1]);

            return response()->json([
                'status' => true,
                'message' => 'User status updated successfully.'
            ], 200);

        }else{
            return response()->json([
                    'status' => false,
                    'message' => 'User id is required.',
                ], 404);
        }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
