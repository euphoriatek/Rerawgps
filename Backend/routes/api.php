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
    Route::get('admin/get-servers-list', [ApiController::class, 'getServerList'])->middleware('auth:users');
    // Super Admin
    Route::post('/admin/add-server', [ServerController::class, 'addServer'])->middleware('auth:users');
    Route::get('/admin/get-servers', [ServerController::class, 'GetServers'])->middleware('auth:users');


    Route::post('/admin/add-admin-usr', [ApiController::class, 'addAdmin'])->middleware('auth:users');
    Route::get('/admin/get-admin-usr', [ApiController::class, 'getAdmin'])->middleware('auth:users');
    Route::post('/admin/edit-admin-user', [ApiController::class, 'UpdateAdminUser'])->middleware('auth:users');
    Route::post('/admin/delete-admin-user', [ApiController::class, 'deleteAdminUser'])->middleware('auth:users');
    Route::post('/admin/edit-server/{id}', [ServerController::class, 'UpdateServers'])->middleware('auth:users');
    Route::post('/admin/delete-server', [ServerController::class, 'deleteServer'])->middleware('auth:users');



    Route::post('/admin/edit-user', [ApiController::class, 'UpdateUser'])->middleware('auth:users');
    Route::delete('/admin/delete-user/{id}', [ApiController::class, 'deleteUser'])->middleware('auth:users');

    // Admin
    Route::post('/admin/register', [ApiController::class, 'register'])->middleware('auth:users');
    Route::get('/admin/users-list', [ApiController::class, 'UsersList'])->middleware('auth:users');
    Route::put('/admin/user-update/{id}', [ApiController::class, 'UpdateUser'])->middleware('auth:users');
    Route::delete('/admin/user-delete/{id}', [ApiController::class, 'DeleteUser'])->middleware('auth:users');

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
    Route::get('/admin/get-admin-servers', [ServerController::class, 'GetAdminServers'])->middleware('auth:users');
    Route::get('/admin/get-admin-users-list', [ApiController::class, 'GetAdminUsersList'])->middleware('auth:users');
});