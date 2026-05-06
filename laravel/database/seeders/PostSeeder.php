<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Faker\Factory as Faker;

use App\Models\Post;
use App\Models\User;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create(config('app.faker_locale', 'id_ID'));
        $now = Carbon::now();
        $dir = 'posts';

        for ($i = 1; $i <= 20; $i++) {
            $title = 'Post ' . $i . ' ' . $faker->sentence(5);
            $content = collect($faker->paragraphs(5))
                ->map(fn($para) => "<p>$para</p>")
                ->implode("");
            $slug = Str::slug($title);

            // Simulasi upload gambar dummy
            $imageName = Str::random(40) . '.png';
            $imagePath = $dir . '/' . $imageName;
            Storage::disk('public')->put($imagePath, file_get_contents(public_path('assets/dummy/news.png')));

            $userIds = User::pluck('id')->toArray();

            Post::create([
                'user_id' => $userIds[array_rand($userIds)],
                'title' => $title,
                'slug' => $slug,
                'content' => $content,
                'image' => $imageName,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
