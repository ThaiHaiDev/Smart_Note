<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Note extends Model
{
    private const FILE_RELATIVE_PATH_PREFIX = "storage/";
    use HasFactory, SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'note_title',
        'note_content',
        'attachment',
        'user_id',
        'category_id',
    ];

    protected $hidden = [
        'is_deleted',
        'deleletd_at',
    ];

    public function getAttachmentAttribute($value)
    {
        if($value == null) {
            return null;
        }
        return self::FILE_RELATIVE_PATH_PREFIX . $value;
    }

    public function labels() {
        return $this->belongsToMany(Label::class, 'note_labels', 'note_id', 'label_id')->withTimestamps()->wherePivotNotNull('label_id');
    }
}