<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use App\Util\StringValidation;

class CreateLabelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'label_name' => ['required', 'string' ,'min:1', 'max:16'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'label_name' => StringValidation::deleteSpace($this->label_name),
        ]);
    }
}
