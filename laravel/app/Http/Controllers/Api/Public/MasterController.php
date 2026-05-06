<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostCollection;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MasterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $limit = $request->limit ?? 6;
            if ($limit > 100) $limit = 6;

            $posts = Post::with('user:id,name,email')
                ->when($request->search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhere('content', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil get ' . $limit . ' data post !',
                'data' => new PostCollection($posts)
            ], 200);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Gagal get data post, ' . addslashes($e->getMessage())], 500);
        }
    }

    public function show(string $slug): JsonResponse
    {
        try {
            $post = Post::with('user')->findBySlug($slug)->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil get detail post !',
                'data' => new PostResource($post)
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan !'], 404);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Gagal get detail post, ' . addslashes($e->getMessage())], 500);
        }
    }
}
