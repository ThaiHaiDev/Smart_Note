<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Category;
use App\Util\StringValidation;

class CreateNoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $categoryId = $this->category_id;
        if ($categoryId == null) {
            return true;
        }

        $category = Category::findOrFail($categoryId);
        return $category && $category->user_id == $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'note_title' => ['required', 'string', 'min:1', 'max:50'],
            'note_content' => 'required|string',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'note_title' =>  StringValidation::deleteSpace($this->note_title),
            'note_content' => StringValidation::deleteSpaceWithoutNewLine($this->note_content),
            'category_id' => htmlentities($this->category_id),
        ]);
    }

}
