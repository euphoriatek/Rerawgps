<?php

namespace App\Http\Controllers;

use App\Models\Servers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class ServerController extends Controller
{

	public function addServer(Request $request)
    {
        $input = $request->all();

        $validator = Validator::make($input, [
            'name' => 'required|string|max:255',
            'server_url' => 'required|string|max:255',
            'access_key' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $server = Servers::create($input);

            return response()->json([
                'status' => true,
                'message' => 'Server added successfully!',
                'data' => $server,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while adding the server.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function GetServers(){
		try {

            $servers = Servers::get();
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
