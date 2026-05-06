<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'title'   => 'API CyberPost - Technical Tes Programmer 2026 Garuda Cyber',
        'version' => '1.0',
    ]);
});
