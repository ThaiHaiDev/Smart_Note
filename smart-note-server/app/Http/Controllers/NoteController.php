<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\User;
use Exception;
use App\Http\Requests\CreateNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Http\Requests\UserCategoryNotesRequest;
use App\Http\Requests\UserNoteRequest;
use App\Http\Requests\UserNotesRequest;
use App\Http\Requests\DeleteNoteRequest;
use App\Models\Category;
use App\Models\NoteLabel;
use App\Util\StringValidation;

class NoteController extends ApiController
{
    private const STORE_PATH_PREFIX = "public/";

    public function getAllNotes()
    {
        try {
            $notes = Note::all();

            return $this->respondWithData($notes);
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function getUserNote(UserNoteRequest $request, string $note_id)
    {
        try {
            $note_id = htmlentities($note_id);
            $note = Note::findOrFail($note_id);
            return $this->respondWithData($note);
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function getUserNotes(UserNotesRequest $request, string $user_id)
    {
        try {
            $user = User::findOrFail($user_id);
            $notes = $user->notes()->get();
            return $this->respondWithData($notes);
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function getCategoryRelatedNotes(UserCategoryNotesRequest $request, string $category_id)
    {
        try {
            $category_id = htmlentities($category_id);
            $validCategory = Category::findOrFail($category_id);
            if (!isset($validCategory)) {
                return $this->respondBadRequest('Category does not exist');
            }
            $notes = $validCategory->notes()->get();

            return $this->respondWithData($notes);
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function getNoteLabels(UserNoteRequest $request, $note_id) {
        try {

            $note = Note::findOrFail($note_id);
            $noteLabels = $note->labels()->get();
            return $this->respondWithData($noteLabels);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function createNote(CreateNoteRequest $request)
    {
        try {
            $note_title = $request->note_title;
            $note_content = $request->note_content;
            $category_id = $request->category_id;
            
            $note = new Note();
            $note->note_title = $note_title;
            $note->note_content = $note_content;
            if ($category_id != null) {
                $note->category_id = $category_id;
            }
            $note->user_id = $request->user()->id;

            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->attachment->store('public');
                $fileName = StringValidation::replaceByPrefix(self::STORE_PATH_PREFIX, $attachmentPath);
                $note->attachment = $fileName;
            }
            $note->save();

            $note->labels()->attach($request->label_ids);

            return $this->respondWithData($note);
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function getNoteAttachment(string $note_id)
    {
        try {
            $note = Note::findOrFail($note_id);

            return $this->respondWithData($note);
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function deleteNoteAttachment(string $note_id)
    {
        try {
            $note = Note::findOrFail($note_id);
            $noteAttachFileName = $note->attachment;
            // Delete attachment if existed
            if (isset($noteAttachFileName)) {
                $filepathToDelete = $noteAttachFileName;

                unlink($filepathToDelete);
                $note->attachment = null;

                $note->save();
                return $this->respondWithData([
                    'message' => 'Deleted successfully',
                    'notes' => $note,
                ]);
            } else {
                return $this->respondBadRequest('Note does not have attachment');
            }
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function updateNoteAttachment(UpdateNoteRequest $request, string $note_id)
    {
        try {
            $note = Note::findOrFail($note_id);
            // Delete old attachment if any
            if (isset($note->attachment)) {
                $fileName = $note->attachment;
                $filePathToDelete = $fileName;
                unlink($filePathToDelete);
                $note->attachment = null;
            }
            // Update attachment
            $attachmentPath = $request->attachment->store('public');
            $fileName = StringValidation::replaceByPrefix(self::STORE_PATH_PREFIX, $attachmentPath);
            $note->attachment = $fileName;
            $note->save();

            return $this->respondWithData($note);
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }
    
    public function updateNote(UpdateNoteRequest $request, string $id)
    {
        try {
            $validNote = Note::findOrFail($id);
            $validNote->note_title = $request->note_title != null ? $request->note_title : $validNote->note_title;
            $validNote->note_content = $request->note_content != null ? $request->note_content : $validNote->note_content;
            if (isset(($request->category_id))) {
                $validNote->category_id = htmlentities($request->category_id);
            }
            $validNote->labels()->sync($request->label_ids);

            if (isset($validNote->attachment)) {
                $fileName = $validNote->attachment;
                $filePathToDelete = $fileName;
                unlink($filePathToDelete);
                $validNote->attachment = null;
            }
            // Update attachment
            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->attachment->store('public');
                $fileName = StringValidation::replaceByPrefix(self::STORE_PATH_PREFIX, $attachmentPath);
                $validNote->attachment = $fileName;
            }

            $validNote->save();

            return $this->respondWithData($validNote);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function deleteNote(DeleteNoteRequest $request, string $note_id)
    {
        try {
            $user_id = $request->user()->id;
            $note = Note::where('user_id', $user_id)->where('id', $note_id)->first();
            $noteAttachFileName = $note->attachment;

            if (!$note) {
                return $this->respondNotFound('Note not found');
            }
            $note->labels()->detach();

            // Delete attachment if existed
            if (isset($noteAttachFileName)) {
                $filepathToDelete = $noteAttachFileName;

                unlink($filepathToDelete);
            }
            $note->delete();
            return $this->respondSuccess("Note deleted successfully");
        } catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

}
