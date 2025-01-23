<?php

use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PoiController;
use App\Http\Controllers\RegayKarPlansController;
use App\Http\Controllers\HistoryController;


use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;
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

    // Dashboard  Data
    Route::get('admin/dashboard-data', [ApiController::class, 'getDashboard'])->middleware('role:superadmin');
    
    // Server opration
    Route::post('/admin/add-server', [ServerController::class, 'addServer'])->middleware('role:superadmin');
    Route::get('/admin/get-servers', [ServerController::class, 'GetServers'])->middleware('role:superadmin');
    Route::post('/admin/update-server', [ServerController::class, 'UpdateServers'])->middleware('role:superadmin');
    Route::post('/admin/delete-server', [ServerController::class, 'deleteServer'])->middleware('role:superadmin');
    // End sever opration

    // admin user opration
    Route::post('/admin/add-admin-usr', [ApiController::class, 'addAdmin'])->middleware('role:superadmin');
    Route::get('/admin/get-admin-usr', [ApiController::class, 'getAdmin'])->middleware('role:superadmin');
    Route::post('/admin/edit-admin-user', [ApiController::class, 'UpdateAdminUser'])->middleware('role:superadmin');
    Route::post('/admin/delete-admin-user', [ApiController::class, 'deleteAdminUser'])->middleware('role:superadmin');
    // End admin user opration

    // List all RegayKar Users
    Route::get('/admin/users-list', [ApiController::class, 'UsersList'])->middleware('role:superadmin');
    // Change Password
    Route::post('/admin/change-password', [ApiController::class, 'changePassword'])->middleware('role:superadmin');
    // List all Sales
    Route::get('/admin/get-objects-list', [SalesController::class, 'getObjectsList'])->middleware('role:superadmin');
    
    Route::post('/admin/masquerade/{userId}', [ApiController::class, 'masquerade'])->middleware('role:superadmin');

    // Common API for super Admin and admin
    // RegayKar user opration
    Route::post('/admin/add-regaykar-user', [ApiController::class, 'register'])->middleware('auth:users');
    Route::post('/admin/edit-regaykar-user', [ApiController::class, 'UpdateUser'])->middleware('auth:users');
    Route::delete('/admin/delete-regaykar-user/{id}', [ApiController::class, 'deleteUser'])->middleware('auth:users');
    // Udpate status for admin and user
    Route::post('/admin/update-user-status', [ApiController::class, 'updateStatus'])->middleware('auth:users');
    // User Information by Id
    Route::post('admin/get-user-info', [ApiController::class, 'getUserInfo'])->middleware('auth:users');

    // Sale agent opration
    Route::post('/admin/add-object',  [SalesController::class, 'store'])->middleware('auth:users');
    Route::post('/admin/get-objects',  [SalesController::class, 'getObjects'])->middleware('auth:users');
    Route::post('/admin/update-objects',  [SalesController::class, 'updateObject'])->middleware('auth:users');
    Route::delete('/admin/delete-object/{id}',  [SalesController::class, 'deleteObject'])->middleware('auth:users');
    // End Sale agent opration
    
    // --------------
    // Admin API
    // Server List
    Route::get('/admin/get-admin-servers', [ServerController::class, 'GetAdminServers'])->middleware('role:admin');
    // RegayKar Users List
    Route::get('/admin/get-admin-regaykar-usrs', [ApiController::class, 'GetAdminRegaykar'])->middleware('role:admin');
    // Sale agent List
    Route::get('/admin/get-admin-objects-list', [SalesController::class, 'getAdminObjectsList'])->middleware('role:admin');
    
    
    // --------------
    // RegayKar User
    // pois
    Route::get('/pois', [PoiController::class, 'getPois'])->middleware('role:user');
    // pendingrequest
    Route::get('/pending-pois', [PoiController::class, 'getPendingPois'])->middleware('role:user');
    Route::post('/edit-poi', [PoiController::class, 'updatePoi'])->middleware('role:user');
    Route::post('/poi-update-status', [PoiController::class, 'updatePoiStatus'])->middleware('role:user');
    // Group
    Route::get('/get-group-list', [GroupController::class, 'getGroupList'])->middleware('auth:users');
    Route::post('/create-group', [GroupController::class, 'store'])->middleware('auth:users');
    Route::post('/edit-group', [GroupController::class, 'editGroup'])->middleware('auth:users');
    Route::delete('/delete-group/{id}', [GroupController::class, 'deleteGroupUser'])->middleware('auth:users');
    Route::get('/get-sales-options', [SalesController::class, 'getSalesOptions'])->middleware('auth:users');
    Route::get('/get-pois-options', [PoiController::class, 'getPoisOptions'])->middleware('auth:users');
    // Plans
    Route::get('/get-regaykar-plans', [RegayKarPlansController::class, 'getCurrentPlans'])->middleware('role:user');
    Route::post('/create-plan', [RegayKarPlansController::class, 'store'])->middleware('role:user');
    Route::post('/update-plan', [RegayKarPlansController::class, 'updatePlan'])->middleware('role:user');
    Route::delete('/delete-plan/{id}', [RegayKarPlansController::class, 'deletePlan'])->middleware('role:user');
    // history
    Route::get('/get-history', [HistoryController::class, 'getHistory'])->middleware('role:user');

    // saleagent
    Route::post('/get-sales-objects', [SalesController::class, 'getsalesObjects'])->middleware('auth:users');
    Route::get('/sync-data', [PoiController::class, 'syncData'])->middleware('auth:users');
    // --------------
    // Sales Agent
    Route::post('/pois', [PoiController::class, 'store'])->middleware('auth:sales');
});
// Route::get('/sync-data', [PoiController::class, 'syncData']);