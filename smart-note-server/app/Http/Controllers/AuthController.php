<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Category;
use App\Util\StringValidation;
use Illuminate\Support\Facades\Hash;
use Exception;
use App\Http\Controllers\ApiController;

class AuthController extends ApiController
{
    private const TOKEN_PREFIX = "Bearer ";

    public function signUp(SignUpRequest $request)
    {
        try {
            $email =  StringValidation::deleteSpace($request->email);
            $saltSecrect = env("PASSWORD_SALT_SECRET");
            $passwordSalt = StringValidation::deleteSpace($request->password . $saltSecrect);
            $hashedPassword = Hash::make($passwordSalt);

            $user = new User();
            $user->username = $request->username;
            $user->email = $email;
            $user->password = $hashedPassword;
            $user->save();

            // Create uncategorized category for user
            $category = new Category();
            $category->category_name = "Uncategorized";
            $category->user_id = $user->id;
            $category->save();

            // Generate user token
            $tokenName = env('USER_AUTH_TOKEN');
            $token = $user->createToken($tokenName);

            return $this->respondWithData([
                'user' => $user,
                'token' => self::TOKEN_PREFIX . $token->plainTextToken,
            ]);
        }
        catch(Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function signIn(SignInRequest $request)
    {
        try {
            $email = $request->email;
            $password = $request->password;
            $passwordSalt = $password.env('PASSWORD_SALT_SECRET');

            if (!User::where('email', $email)->exists()) {
                return response()->json([
                    'message' => 'Unauthorized',
                    'errors' => [
                        'email' => 'User not found',
                    ],
                ], 401);
            }
            if (!Auth::attempt(['email' => $email, 'password' => $passwordSalt])) {
                return response()->json([
                    'message' => 'Unauthorized',
                    'errors' => [
                        'password' => 'Invalid password',
                    ],
                ], 401);
            }

            $user = Auth::user();
            $token = $request->user()->createToken(env('USER_AUTH_TOKEN'))->plainTextToken;
            return $this->respondWithData([
                'user' => $user,
                'token' => self::TOKEN_PREFIX.$token
            ]);
        }
        catch (Exception $exeption) {
            return $this->respondInternalServerError($exeption->getMessage());
        }
    }
}