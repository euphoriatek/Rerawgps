<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\SaleAgentController;
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

Route::post('/register', [ApiController::class, 'register']);
Route::post('/login', [ApiController::class, 'login']);
Route::post('/admin-logout', [ApiController::class, 'logout']);
Route::get('/get-translation', [TranslationController::class, 'getTranslation']);
Route::post('/store_translations', [TranslationController::class, 'store']);
Route::post('/languages', [LanguageController::class, 'store']);
Route::post('/sale-agents', [SaleAgentController::class, 'store']);

Route::get('/users-list', [ApiController::class, 'UsersList']);
Route::get('/users', [ApiController::class, 'Users']);