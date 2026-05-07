<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

use Faker\Factory as Faker;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create(config('app.faker_locale', 'id_ID'));
        $now = Carbon::now();

        User::create([
            'name' => 'Testing User',
            'email' => 'testing@gmail.com',
            'password' => Hash::make('Password123-'), // Default password
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        for ($i = 1; $i <= 3; $i++) {
            User::create([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'password' => Hash::make('Password123-'), // Default password
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
