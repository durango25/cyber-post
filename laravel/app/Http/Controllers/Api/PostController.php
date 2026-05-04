<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostCollection;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request): PostCollection
    {
        $query = Post::with('user');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($title = $request->query('title')) {
            $query->where('title', 'like', "%{$title}%");
        }

        if ($content = $request->query('content')) {
            $query->where('content', 'like', "%{$content}%");
        }

        $posts = $query->latest()->paginate($request->query('per_page', 10));

        return new PostCollection($posts);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $imagePath = null;
        if ($request->hasFile('main_image')) {
            $imagePath = $request->file('main_image')->store('posts', 'public');
        }

        $slug = $this->uniqueSlug($request->title);

        $post = Post::create([
            'title'      => $request->title,
            'slug'       => $slug,
            'content'    => $request->content,
            'main_image' => $imagePath,
            'user_id'    => $request->user()->id,
        ]);

        $post->load('user');

        return response()->json(['data' => new PostResource($post)], 201);
    }

    public function show(Post $post): JsonResponse
    {
        $post->load('user');

        return response()->json(['data' => new PostResource($post)]);
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        if ($request->user()->cannot('update', $post)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->only(['title', 'content']);

        if ($request->hasFile('main_image')) {
            $data['main_image'] = $request->file('main_image')->store('posts', 'public');
        }

        if (isset($data['title']) && $data['title'] !== $post->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $post->id);
        }

        $post->update($data);
        $post->load('user');

        return response()->json(['data' => new PostResource($post)]);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        if ($request->user()->cannot('delete', $post)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function uniqueSlug(string $title, ?int $excludeId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (
            Post::where('slug', $slug)
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
