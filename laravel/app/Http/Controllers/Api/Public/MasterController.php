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
            // Pagination
            $page = $request->page ?? 1;
            $limit = (int) ($request->limit ?? 10);
            if ($limit > 100) $limit = 10;
            $offset = ($page - 1) * $limit;

            $filterQuick = $request->search ? array_filter(explode(' ', trim($request->search))) : null;

            // All Data Count
            $dataAll = Post::when($filterQuick, function ($q) use ($filterQuick) {
                foreach ($filterQuick as $word) {
                    $q->where(function ($r) use ($word) {
                        $r->where('title', 'LIKE', '%' . $word . '%');
                    });
                }
            })->count('id');

            // Displayed Data (Limit)
            $data = Post::with('user:id,name,email')
                ->when($filterQuick, function ($q) use ($filterQuick) {
                    foreach ($filterQuick as $word) {
                        $q->where(function ($r) use ($word) {
                            $r->where('title', 'LIKE', '%' . $word . '%');
                        });
                    }
                })
                ->latest();
            $data = $data->offset($offset)->take($limit)
                ->get(['id', 'title', 'slug', 'content', 'image', 'user_id', 'created_at', 'updated_at'])
                ->makeVisible(['image_url']);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil get data post !',
                'data' => [
                    'data'  => new PostCollection($data),
                    'total' => $dataAll,
                ]
            ], 200);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Gagal get data post, ' . addslashes($e->getMessage())], 500);
        }
    }

    public function get_highlight(Request $request): JsonResponse
    {
        try {
            $limit = (int) ($request->limit ?? 6);
            if ($limit > 12) $limit = 6;

            $posts = Post::with('user:id,name')
                ->latest()
                ->limit($limit)
                ->get(['id', 'title', 'slug', 'image', 'user_id', 'created_at'])
                ->makeVisible(['image_url']);

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
            $post = $post->makeVisible(['image_url']);

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
