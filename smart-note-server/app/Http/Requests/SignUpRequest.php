<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignUpRequest extends FormRequest
{
    // User password contains at least one uppercase letter, one lowercase letter and one special characters in any orders
    protected $passwordSantize = 'regex:/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.]).*$/';

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
            'username' => ['required', 'string', 'max:50', 'unique:users'],
            'email' => [
                'required',
                'unique:users',
                'min:6',
                'max:50',
                'regex:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/',
            ],
            'password' => [
                'required', 
                'confirmed',
                'min:8',
                'max:16'
            ],
        ];
    }
}
