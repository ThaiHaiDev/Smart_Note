<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LabelController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->controller(CategoryController::class)->prefix('categories')->group(function () {
    Route::get('/{user_id}', 'getUserRelatedCategories');
    Route::get('/', 'getAllCategories');
    Route::post('/', 'createCategory');
    Route::delete('/{category_id}', 'deleteCategory');
});

Route::middleware("auth:sanctum")->controller(LabelController::class)->prefix('labels')->group(function () {
    Route::get('/{user_id}', 'getUserRelatedLabels');
    Route::get('/', 'getAllLabels');
    Route::get('/{label_id}/notes', 'getLabelNotes');
    Route::post('/', 'createLabel');
    Route::delete('/{label_id}', 'deleteLabel');
});

Route::middleware('auth:sanctum')->controller(NoteController::class)->prefix('notes')->group(function () {
    Route::get('/', 'getAllNotes');
    Route::get('/{note_id}', 'getUserNote');
    Route::get('/users/{user_id}', 'getUserNotes');
    Route::get('/category/{category_id}', 'getCategoryRelatedNotes');
    Route::get('/{note_id}/attachment', 'getNoteAttachment');
    Route::get('/{note_id}/labels', 'getNoteLabels');

    Route::post('/', 'createNote');
    Route::post('/{note_id}', 'updateNote');
    Route::post('/{note_id}/attachment/update', 'updateNoteAttachment');
    
    Route::delete('/{note_id}/attachment', 'deleteNoteAttachment');
    Route::delete('/{note_id}', 'deleteNote');
});

Route::controller(AuthController::class)->group(function () {
    Route::post('/sign-in', 'signIn');
    Route::post('/sign-up', 'signUp');
});

