<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Label extends Model
{
    use HasFactory;

    protected $fillable = [
        'label_name',
        'user_id'
    ];

    public function notes() {
        return $this->belongsToMany(Note::class, 'note_labels', 'label_id', 'note_id')->withTimestamps()->wherePivotNotNull('note_id');
    }
}
