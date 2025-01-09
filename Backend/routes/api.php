<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\GroupController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [ApiController::class, 'UserLogin']);
// Route::post('/logout', [ApiController::class, 'login']);

Route::post('/admin/login', [ApiController::class, 'login']);
// Route::post('/admin/logout', [ApiController::class, 'logout']);

Route::post('/sales/login', [SalesController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    // Super Admin API
    Route::get('admin/dashboard-data', [ApiController::class, 'getDashboard'])->middleware('role:superadmin');

    Route::post('/admin/add-server', [ServerController::class, 'addServer'])->middleware('role:superadmin');
    Route::get('/admin/get-servers', [ServerController::class, 'GetServers'])->middleware('role:superadmin');
    Route::post('/admin/update-server', [ServerController::class, 'UpdateServers'])->middleware('role:superadmin');
    Route::post('/admin/delete-server', [ServerController::class, 'deleteServer'])->middleware('role:superadmin');

    Route::post('/admin/add-admin-usr', [ApiController::class, 'addAdmin'])->middleware('role:superadmin');
    Route::get('/admin/get-admin-usr', [ApiController::class, 'getAdmin'])->middleware('role:superadmin');
    Route::post('/admin/edit-admin-user', [ApiController::class, 'UpdateAdminUser'])->middleware('role:superadmin');
    Route::post('/admin/delete-admin-user', [ApiController::class, 'deleteAdminUser'])->middleware('role:superadmin');

    // Common API for super Admin and admin
    Route::post('/admin/add-regaykar-user', [ApiController::class, 'register'])->middleware('auth:users');
    Route::post('/admin/edit-regaykar-user', [ApiController::class, 'UpdateUser'])->middleware('auth:users');
    Route::delete('/admin/delete-regaykar-user/{id}', [ApiController::class, 'deleteUser'])->middleware('auth:users');
    Route::post('/admin/update-user-status', [ApiController::class, 'updateStatus'])->middleware('auth:users');

    // Admin API
    Route::get('/admin/get-admin-servers', [ServerController::class, 'GetAdminServers'])->middleware('role:admin');
    Route::get('/admin/get-admin-users-list', [ApiController::class, 'GetAdminUsersList'])->middleware('role:admin');
    
   
    
    Route::get('/admin/users-list', [ApiController::class, 'UsersList'])->middleware('auth:users');

    Route::post('/admin/add-object',  [SalesController::class, 'store'])->middleware('auth:users');
    Route::post('/admin/get-objects',  [SalesController::class, 'getObjects'])->middleware('auth:users');
    Route::post('/admin/update-objects',  [SalesController::class, 'updateObject'])->middleware('auth:users');
    Route::delete('/admin/delete-object/{id}',  [SalesController::class, 'deleteObject'])->middleware('auth:users');
    
    // User
    Route::get('/admin/get-object-list', [SalesController::class, 'getObjectList'])->middleware('auth:users');
    Route::get('/get-objects', [SalesController::class, 'getObjects'])->middleware('auth:users');
    // Route::get('/get-object-list', [SalesController::class, 'getObjectList'])->middleware('auth:sales');

    Route::post('/admin/create-group', [GroupController::class, 'store'])->middleware('auth:users');

    Route::post('admin/get-user-info', [ApiController::class, 'getUserInfo'])->middleware('auth:users');

    // Admin Api
    Route::post('/create-group', [GroupController::class, 'store']);
    Route::get('/get-group-users-list', [GroupController::class, 'getGroupUserList']);
    Route::post('/edit-group-user', [GroupController::class, 'editGroup']);
    Route::delete('/delete-group-user/{id}', [GroupController::class, 'deleteGroupUser']);
    Route::post('/get-sales-objects', [SalesController::class, 'getsalesObjects'])->middleware('auth:users');
    
});