<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

use App\Models\User;
use App\Http\Requests\AuthRequest;

class AuthController extends Controller
{

    public function act_register(AuthRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {

            User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil melakukan pendaftaran !',
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal melakukan pendaftaran, ' . addslashes($e->getMessage())], 500);
        }
    }

    public function act_login(AuthRequest $request): JsonResponse
    {
        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email / Password salah !',
                ], 401);
            }

            /** @var \App\Models\User $user */
            $user  = Auth::user();
            $respondWithToken = $this->respondWithToken($user);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil login !',
                'data' => array_merge([
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                ], $respondWithToken)
            ], 200);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Gagal melakukan autentikasi, ' . addslashes($e->getMessage())], 500);
        }
    }

    public function act_logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil logout !'
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Gagal melakukan logout, ' . addslashes($e->getMessage())], 500);
        }
    }

    public function act_refresh_token(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {

            $user = $request->user();
            $respondWithToken = $this->respondWithToken($user);
            $user->currentAccessToken()->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil refresh token !',
                'data' => $respondWithToken
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal refresh token, ' . addslashes($e->getMessage())], 500);
        }
    }

    // GET RESPON TOKEN USER
    protected function respondWithToken(User $user, bool $remember = false)
    {
        $expirationMinutes = 24 * 60; // 1 days //config('sanctum.expiration');
        if ($remember)
            $expiresAt = null;
        else
            $expiresAt = Carbon::now()->addMinutes($expirationMinutes);

        $tokenName = 'api-token-' . $user->id;
        $token = $user->createToken($tokenName, expiresAt: $expiresAt);

        return [
            'token_type' => 'Bearer',
            'expires_in' => !$remember ? $expirationMinutes * 60 : null,
            'access_token' => $token->plainTextToken,
            'token_id' => $token->accessToken->id,
        ];
    }
}
