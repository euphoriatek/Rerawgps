<?php

namespace App\Http\Controllers;

use App\Models\Servers;
use App\Models\AssigendServer;
use App\Models\User;
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
            'server_url' => 'required|string|max:255'
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
    public function GetServers()
    {
        try {

            $servers = Servers::whereNull('deleted_at')->get();
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
    public function UpdateServers($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'server_url' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors occurred.',
                'errors' => $validator->errors()
            ], 400);
        }

        $server = Servers::find($id);

        if (!$server) {
            return response()->json([
                'success' => false,
                'message' => 'Server not found.'
            ], 404);
        }

        $server->update([
            'name' => $request->name,
            'server_url' => $request->server_url
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Server updated successfully.',
            'server' => $server
        ], 200);
    }
    public function deleteServer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'server_id' => 'required|exists:servers,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors occurred.',
                'errors' => $validator->errors()
            ], 400);
        }

        $assignedCheck = AssigendServer::where('server_id', $request->input('server_id'))
            ->whereNull('deleted_at')
            ->get();
        if($assignedCheck){
            return response()->json([
                'status' => false,
                'message' => 'Server is Assigned ',
            ], 200);
        }

        $server = Servers::find($request->input('server_id'));

        if (!$server) {
            return response()->json([
                'status' => false,
                'message' => 'Server not found.',
            ], 404);
        }

        $server->deleted_at = now();
        $server->save();

        return response()->json([
            'status' => true,
            'message' => 'Server deleted successfully.',
            'server' => $server
        ], 200);
    }
}
