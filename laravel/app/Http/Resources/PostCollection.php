<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Attributes\Collects;
use Illuminate\Http\Resources\Json\ResourceCollection;

#[Collects(PostResource::class)]
class PostCollection extends ResourceCollection
{
    // public $collects = PostResource::class;

    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
