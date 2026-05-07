<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

use Illuminate\Auth\Access\AuthorizationException;
use \Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 404
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($e->getPrevious() instanceof ModelNotFoundException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan !'
                ], 404);
            }
            return response()->json([
                'success' => false,
                'message' => 'Halaman / API Endpoint tidak ditemukan !'
            ], 404);
        });

        $exceptions->render(function (HttpException $e, Request $request) {
            // 403
            if ($e->getStatusCode() === 403 && $request->is('storage/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Forbidden !'
                ], $e->getStatusCode() ?? 403);
            }
        });

        // 429
        $exceptions->render(function (TooManyRequestsHttpException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Jangan Nge-Spam Dong !',
            ], $e->getStatusCode() ?? 429);
        });

        // 403
        $exceptions->render(function (AuthorizationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Akses dilarang !',
            ], 403);
        });

        // 401
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated !',
            ], 401);
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan !'
            ], 404);
        });

        // Validation 
        $exceptions->render(function (ValidationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Terdapat beberapa isian form yang tidak valid !',
                'errors'  => $e->errors(),
            ], 422);
        });
    })->create();
