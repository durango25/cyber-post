<?php

use App\Http\Controllers\Api as API;
use Illuminate\Support\Facades\Route;

// Route Public
Route::prefix('public')->name('p.')->group(function () {
    Route::prefix('posts')->name('posts.')->group(function () {
        Route::get('/', [API\Public\MasterController::class, 'index'])->name('index');
        Route::get('{slug}', [API\Public\MasterController::class, 'show'])->name('show');
    });
    Route::get('post-highlight', [API\Public\MasterController::class, 'get_highlight'])->name('posts.highlight');
});

// Route Auth Handle
Route::post('/register', [API\AuthController::class, 'act_register'])->name('register');
Route::post('/login', [API\AuthController::class, 'act_login'])->middleware(['throttle:10,1'])->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [API\AuthController::class, 'act_logout'])->name('logout');
    Route::post('/refresh-token', [API\AuthController::class, 'act_refresh_token'])->name('refresh-token');
});

// Route Authenticated
Route::middleware('auth:sanctum')->group(function () {
    // Route Module Post
    Route::apiResource('posts', API\PostController::class);
});
