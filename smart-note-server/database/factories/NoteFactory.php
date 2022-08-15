<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class NoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    { 
        $category = Category::all()->shuffle()->first();

        return [
            'note_title' => fake()->city(),
            'note_content' => fake()->realText(),
            'attachment' => fake()->imageUrl(360, 360, 'animals', true, 'dogs', true),
            'user_id' => $category->user_id,
            'is_deleted' => 0,
            'category_id' => $category->id,
        ];
    }
}
