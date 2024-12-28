<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\SalesController;
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

Route::group(['middleware' => ['auth:sanctum']], function () {

    // Admin
    Route::post('/admin/register', [ApiController::class, 'register']);
    Route::get('/admin/users-list', [ApiController::class, 'UsersList']);
    
    Route::get('/admin/users', [ApiController::class, 'Users']);
    Route::post('/add-object',  [SalesController::class, 'store']);

    // User
    Route::get('/get-object-list', [SalesController::class, 'getObjectList']);
});