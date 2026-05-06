<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\Post;
use App\Http\Resources\PostCollection;
use App\Http\Resources\PostResource;
use App\Http\Requests\PostRequest;

class PostController extends Controller
{

    private $module = 'post';
    private $dir = 'posts'; // (5 char)

    public function index(Request $request): JsonResponse
    {
        try {
            // Pagination
            $page = $request->page ?? 1;
            $limit = $request->limit ?? 10;
            if ($limit > 100) $limit = 10;
            $offset = ($page - 1) * $limit;
            // Sorting
            $sort = $request->sort ?? [];
            $sortCol = $sort['column'] ?? null;
            $sortType = $sort['type'] ?? 'asc';
            // Filter
            $filter = $request->filter ?? [];
            $filterQuick = $filter['quick'] ?? [];
            $filterItem = $filter['items'] ?? [];

            $arrAvailableCol = ['title', 'content', 'created_at'];
            if (!in_array($sortCol, $arrAvailableCol)) $sortCol = 'id';
            if (!in_array($sortType, ['asc', 'desc'])) $sortType = 'asc';

            // All Data Count
            $dataAll = Post::
                // Filter by column
                when(isset($filterItem), function ($q) use ($filterItem, $arrAvailableCol) {
                    foreach ($filterItem as $val) {
                        $filterCol = $val['column'] ?? null;
                        if (!in_array($filterCol, $arrAvailableCol)) $filterCol = null;
                        $filterOperator = isset($val['operator']) ? mapOperator($val['operator']) : null;
                        $filterValue = isset($val['value']) ? ($filterOperator == 'LIKE' ? '%' . $val['value'] . '%' : $val['value']) : null;

                        $q->where($filterCol, $filterOperator, $filterValue);
                    }
                })
                // Filter quick
                ->when(isset($filterQuick), function ($q) use ($filterQuick) {
                    foreach ($filterQuick as $val) {
                        $q->where(function ($r) use ($val) {
                            $r->where('title', 'LIKE', '%' . $val . '%')
                                ->orWhere('content', 'LIKE', '%' . $val . '%');
                        });
                    }
                })
                ->count('id');

            // Displayed Data (Limit)
            $data = Post::with(['user:id,name,email'])
                // Filter by column
                ->when(isset($filterItem), function ($q) use ($filterItem, $arrAvailableCol) {
                    foreach ($filterItem as $val) {
                        $filterCol = $val['column'] ?? null;
                        if (!in_array($filterCol, $arrAvailableCol)) $filterCol = null;
                        $filterOperator = isset($val['operator']) ? mapOperator($val['operator']) : null;
                        $filterValue = isset($val['value']) ? ($filterOperator == 'LIKE' ? '%' . $val['value'] . '%' : $val['value']) : null;

                        $q->where($filterCol, $filterOperator, $filterValue);
                    }
                })
                // Filter quick
                ->when(isset($filterQuick), function ($q) use ($filterQuick) {
                    foreach ($filterQuick as $val) {
                        $q->where(function ($r) use ($val) {
                            $r->where('title', 'LIKE', '%' . $val . '%')
                                ->orWhere('content', 'LIKE', '%' . $val . '%');
                        });
                    }
                })
                // Sort by column
                ->when($sort, function ($q) use ($sortCol, $sortType) {
                    $q->orderBy($sortCol, $sortType);
                })
                // Default sort
                ->when(!$sort, function ($q) { // Default Sort
                    $q->latest();
                });
            $data = $data->offset($offset)->take($limit)
                ->get(['id', 'title', 'slug', 'content', 'image', 'user_id', 'created_at', 'updated_at'])
                ->makeVisible(['image_url']);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil get data ' . $this->module . ' !',
                'data' => [
                    'data' => new PostCollection($data), // $data,
                    'total' => $dataAll,
                ]
            ], 200);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Gagal get data ' . $this->module . ', ' . addslashes($e->getMessage())], 500);
        }
    }

    public function store(PostRequest $request): JsonResponse
    {
        DB::beginTransaction();
        $imageName = null;
        try {
            $image = $request->file('image');
            if ($image) {
                // Validation tambahan (Pernah kebocoran saat pentest oleh BSSN)
                $allowedExt = ['jpg', 'jpeg', 'png'];
                $allowedMime = ['image/jpeg', 'image/png'];
                $allowedImageType = [IMAGETYPE_PNG, IMAGETYPE_JPEG];
                $imageName = $image->hashName();

                // Validasi extension asli
                $imageExt = $image->extension();
                if (!in_array($imageExt, $allowedExt, true)) {
                    throw ValidationException::withMessages([
                        'image' => 'File Gambar tidak valid (Ext) !',
                    ]);
                }
                // Validasi mimeType asli
                $imageMime = $image->getMimeType();
                if (!in_array($imageMime, $allowedMime, true)) {
                    throw ValidationException::withMessages([
                        'image' => 'File Gambar tidak valid (Mime) !',
                    ]);
                }
                // Validasi isi file (signature)
                $imageType = exif_imagetype($image->getPathname());
                if (!in_array($imageType, $allowedImageType)) {
                    throw ValidationException::withMessages([
                        'image' => 'File Gambar tidak valid (Mime [2]) !',
                    ]);
                }
                $imageType = getimagesize($image->getPathname());
                if ($imageType === false || !in_array($imageType[2], $allowedImageType)) {
                    throw ValidationException::withMessages([
                        'image' => 'File Gambar tidak valid (Mime [3]) !',
                    ]);
                }
            }

            $data = [
                'title' => $request->title,
                'slug' => $request->slug,
                'content' => $request->content,
                'image' => $image ? $this->dir . '/' . $imageName : null,
                'user_id'    => Auth::user()->id,
            ];
            $post = Post::create($data);

            // Move upload image file
            if ($image) {
                $image->storeAs($this->dir, $imageName, 'public');
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Berhasil menambah data ' . $this->module . ' !',
                'data' => $post->only(['id', 'title', 'slug']),
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            if ($imageName) {
                $imagePath = $this->dir . '/' . $imageName;
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
            return response()->json(['success' => false, 'message' => 'Gagal menambah data ' . $this->module . ', ' . addslashes($e->getMessage())], 500);
        }
    }

    public function show(Post $post): JsonResponse
    {
        try {
            $post->load('user')->makeVisible(['image_url']);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil get detail ' . $this->module . ' !',
                'data' => new PostResource($post)
            ], 200);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Gagal get detail ' . $this->module . ', ' . addslashes($e->getMessage())], 500);
        }
    }

    public function update(PostRequest $request, Post $post): JsonResponse
    {
        DB::beginTransaction();
        $imageName = null;
        try {
            if ($request->user()->cannot('update', $post)) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            $imageOld = $post->image;

            $image = $request->file('image');
            if ($image) {
                // Validation tambahan (Pernah kebocoran saat pentest oleh BSSN)
                $allowedExt = ['jpg', 'jpeg', 'png'];
                $allowedMime = ['image/jpeg', 'image/png'];
                $allowedImageType = [IMAGETYPE_PNG, IMAGETYPE_JPEG];
                $imageName = $image->hashName();

                // Validasi extension asli
                $imageExt = $image->extension();
                if (!in_array($imageExt, $allowedExt, true)) {
                    throw ValidationException::withMessages([
                        'image' => 'File Gambar tidak valid (Ext) !',
                    ]);
                }
                // Validasi mimeType asli
                $imageMime = $image->getMimeType();
                if (!in_array($imageMime, $allowedMime, true)) {
                    throw ValidationException::withMessages([
                        'image' => 'File Gambar tidak valid (Mime) !',
                    ]);
                }
                // Validasi isi file (signature)
                $imageType = exif_imagetype($image->getPathname());
                if (!in_array($imageType, $allowedImageType)) {
                    throw ValidationException::withMessages([
                        'image' => 'File Gambar tidak valid (Mime [2]) !',
                    ]);
                }
                $imageType = getimagesize($image->getPathname());
                if ($imageType === false || !in_array($imageType[2], $allowedImageType)) {
                    throw ValidationException::withMessages([
                        'image' => 'File Gambar tidak valid (Mime [3]) !',
                    ]);
                }
            }

            $data = [
                'title' => $request->title,
                'slug' => $request->slug,
                'content' => $request->content,
            ];
            if ($image) {
                $data['image'] = $this->dir . '/' . $imageName;
            }
            $post->update($data);

            // Move upload image file
            if ($image) {
                $image->storeAs($this->dir, $imageName, 'public');
                // Delete old image
                if ($imageOld) {
                    if (Storage::disk('public')->exists($imageOld)) {
                        Storage::disk('public')->delete($imageOld);
                    }
                }
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengubah data ' . $this->module . ' !',
                'data' => $post->only(['id', 'title', 'slug']),
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            if ($imageName) {
                $imagePath = $this->dir . '/' . $imageName;
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
            return response()->json(['success' => false, 'message' => 'Gagal mengubah data ' . $this->module . ', ' . addslashes($e->getMessage())], 500);
        }
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        DB::beginTransaction();
        try {
            if ($request->user()->cannot('delete', $post)) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            $imageOld = $post->image;
            $post->delete();

            // Delete old image
            if ($imageOld) {
                if (Storage::disk('public')->exists($imageOld)) {
                    Storage::disk('public')->delete($imageOld);
                }
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Berhasil menghapus data ' . $this->module . ' !',
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal menghapus data ' . $this->module . ', ' . addslashes($e->getMessage())], 500);
        }
    }
}
