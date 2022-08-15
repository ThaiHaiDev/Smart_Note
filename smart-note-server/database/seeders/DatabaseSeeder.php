<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Seed 10 users
        \App\Models\User::factory(10)->create();
        // Seed 10 categories
        \App\Models\Category::factory(10)->create();
        // Seed 10 notes
        \App\Models\Note::factory(10)->create();
        // Seed 56 labels
        \App\Models\Label::factory(56)->create();
        // Seed 40 note_labels
        \App\Models\NoteLabel::factory(40)->create();
    }
}
