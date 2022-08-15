<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserLabelRequest;
use App\Models\Label;
use App\Models\NoteLabel;
use App\Http\Requests\CreateLabelRequest;
use App\Http\Requests\DeleteLabelRequest;
use App\Http\Requests\LabelNotesRequest;
use Exception;

class LabelController extends ApiController
{
    public function getAllLabels()
    {
        try {
            $labels = Label::all();
            return $this->respondWithData($labels);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function getUserRelatedLabels(UserLabelRequest $request, string $user_id)
    {
        try {
            $labels = Label::where('user_id', $user_id)->get();
            if(!isset($labels)) {
                return $this->respondNotFound('No labels found');
            }
            return $this->respondWithData($labels);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function getLabelNotes(LabelNotesRequest $request, $label_id)
    {
        try {
            $label = Label::where('id', $label_id)->first();
            if(!isset($label)) {
                return $this->respondNotFound('No label found');
            }
            $labelNotes = $label->notes()->get();
            return $this->respondWithData($labelNotes);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }

    }

    public function createLabel(CreateLabelRequest $request)
    {
        $label_name = $request->label_name;
        $user_id = $request->user()->id;
        
        try {
            $label = Label::where('label_name', $label_name)->where('user_id', $user_id)->first();
            if ($label) {
                return $this->respondBadRequest('Label already exists');
            }

            $label = new Label();
            $label->label_name = $label_name;
            $label->user_id = $user_id;
            $label->save();
            return $this->respondWithData($label);
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }

    public function deleteLabel(DeleteLabelRequest $request, string $label_id) 
    {
        try {
            $user_id = $request->user()->id;
            $label = Label::where('user_id', $user_id)->where('id', $label_id)->first();

            if(!$label) {
                return $this->respondNotFound('Label not found');
            }
            $label->notes()->detach();

            $label->delete();

            return $this->respondSuccess('Label deleted successfully');
        }
        catch (Exception $exception) {
            return $this->respondInternalServerError($exception->getMessage());
        }
    }
}
