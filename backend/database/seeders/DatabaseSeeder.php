<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CategorySeeder::class);
        $this->call(GameSeeder::class);

        if (! env('DEMO_ADMIN_EMAIL')) {
            return;
        }
        User::query()->updateOrCreate(
            ['email' => env('DEMO_ADMIN_EMAIL')],
            [
                'name' => 'Test User',
                'password' => bcrypt(env('DEMO_ADMIN_PASSWORD')),
                'is_admin' => true,
            ],
        );
    }
}
