<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserCategoryRequest;
use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\DeleteCategoryRequest;
use App\Models\Category;
use App\Models\Note;
use Exception;

class CategoryController extends ApiController
{
    public function getAllCategories()
    {
        try {
            $categories = Category::all();
            return $this->respondWithData($categories);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function getUserRelatedCategories(UserCategoryRequest $request, string $user_id)
    {
        try {
            $categories = Category::where('user_id', $user_id)->get();
            if(!isset($categories)) {
                return $this->respondNotFound('No categories found');
            }
            return $this->respondWithData($categories);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function createCategory(CreateCategoryRequest $request)
    {
        $category_name = $request->category_name;
        $user_id = $request->user()->id;

        try {
            $category = Category::where('category_name', $category_name)->where('user_id', $user_id)->first();
            if ($category) {
                return $this->respondBadRequest('Category already exists');
            }

            $category = new Category();
            $category->category_name = $category_name;
            $category->user_id = $user_id;
            $category->save();
            return $this->respondWithData($category);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    // Move all notes from category 1 to category 2
    protected function moveNotes(Category $category1, Category $category2)
    {
        $notes = Note::where('category_id', $category1->id)->get();
        foreach ($notes as $note) {
            $note->category_id = $category2->id;
            $note->save();
        }
    }

    public function deleteCategory(DeleteCategoryRequest $request, string $category_id)
    {
        try {
            $user_id = $request->user()->id;
            $category = Category::where('id', $category_id)->first();
            if (!$category) {
                return $this->respondNotFound('Category not found');
            }

            if ($category->category_name == 'Uncategorized') {
                return $this->respondForbidden('You cannot delete the Uncategorized category');
            }

            $uncategorized = Category::where('user_id', $user_id)->where('category_name', 'Uncategorized')->first();
            $this->moveNotes($category, $uncategorized);

            $category->delete();
            return $this->respondSuccess('Category deleted');
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }
}
