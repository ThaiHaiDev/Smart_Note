<?php

namespace App\Http\Requests;

use App\Models\Note;
use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use App\Util\StringValidation;

class UpdateNoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $noteId = $this->route('note_id');
        $note = Note::findOrFail($noteId);
        $canUpdate = $note && $this->user()->can('update', [Note::class, $note]);

        if (isset($this->category_id)) {
            $category = Category::findOrFail($this->category_id);
            $isUserCategory = $category->user_id == $this->user()->id;
            return $isUserCategory && $canUpdate;
        }

        return $canUpdate;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'note_title' => StringValidation::deleteSpace($this->note_title),
            'note_content' => StringValidation::deleteSpaceWithoutNewLine($this->note_content),
        ]);
    }

}
