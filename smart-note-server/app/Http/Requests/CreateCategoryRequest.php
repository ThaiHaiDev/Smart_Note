<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use App\Util\StringValidation;

class CreateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user_id = $this->user_id;
        return $user_id && $this->user()->id == $user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'category_name' => ['required', 'string', 'min:1', 'max:16'],
            'user_id' => ['required'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'category_name' => StringValidation::deleteSpace($this->category_name),
        ]);
    }

}
