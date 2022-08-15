<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $userIds = array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        return [
            'user_id' => $userIds[array_rand($userIds)],
            'category_name' => fake()->domainName(),
        ];
    }
}
