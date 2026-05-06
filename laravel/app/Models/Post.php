<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    protected $fillable = ['title', 'slug', 'content', 'image', 'user_id'];

    protected $hidden = [
        'image_url',
    ];

    // Custom Query
    public function scopeFindBySlug(Builder $query, string $slug): Builder
    {
        return $query->where('slug', $slug);
    }

    // Custom Attribute
    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    // RELATION
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
