<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\ServerController;
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
    // Super Admin
    Route::post('/admin/add-server', [ServerController::class, 'addServer'])->middleware('auth:users');
    Route::get('/admin/get-servers', [ServerController::class, 'GetServers'])->middleware('auth:users');
    Route::post('/admin/edit-server/{id}', [ServerController::class, 'UpdateServers'])->middleware('auth:users');
    Route::post('/admin/delete-server', [ServerController::class, 'deleteServer'])->middleware('auth:users');
    // Admin
    Route::post('/admin/register', [ApiController::class, 'register'])->middleware('auth:users');
    Route::get('/admin/users-list', [ApiController::class, 'UsersList'])->middleware('auth:users');
    Route::put('/admin/user-update/{id}', [ApiController::class, 'UpdateUser'])->middleware('auth:users');
    Route::delete('/admin/user-delete/{id}', [ApiController::class, 'DeleteUser'])->middleware('auth:users');

    Route::post('/admin/add-object',  [SalesController::class, 'store'])->middleware('auth:users');

    // User
    Route::get('/admin/get-object-list', [SalesController::class, 'getObjectList'])->middleware('auth:users');
    Route::get('/get-objects', [SalesController::class, 'getObjects'])->middleware('auth:users');
    // Route::get('/get-object-list', [SalesController::class, 'getObjectList'])->middleware('auth:sales');
});