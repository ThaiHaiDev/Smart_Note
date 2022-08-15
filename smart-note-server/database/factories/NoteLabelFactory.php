<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Note;
use App\Models\Label;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NoteLabel>
 */
class NoteLabelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $userId = User::all('id')->shuffle()->first();
        $note = Note::all('id', 'user_id')->where('user_id', '=', $userId->id)->where('id', '!=', null)->first();
        $label = Label::all('id', 'user_id')->where('user_id', '=', $userId->id)->where('id', '!=', null)->first();

        return [
            'note_id' => isset($note->id) ? $note->id : null,
            'label_id' => isset($label->id) ? $label->id : null,
        ];
    }
}
