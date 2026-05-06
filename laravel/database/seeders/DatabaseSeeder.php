<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Delete all directories in disk public
        $directories = ['posts'];
        foreach ($directories as $dir) {
            if (Storage::disk('public')->exists($dir)) {
                Storage::disk('public')->deleteDirectory($dir);
                $this->command->info("🧹 Folder storage '{$dir}' has been deleted.");
            }
        }
        $this->command->line("\n");

        // Run all seeders
        $seeders = [
            UserSeeder::class,
            PostSeeder::class,
        ];

        foreach ($seeders as $seeder) {
            $this->command->warn("⏳ Running seeder: {$seeder}");
            $this->call($seeder);
            $this->command->info("✅ Completed: {$seeder}");
            $this->command->line("\n");
        }

        $this->command->line("\n🎉 All seeders have been executed !\n", 'fg=green');
    }
}
