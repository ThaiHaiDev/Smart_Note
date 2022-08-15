<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create notes table if not exists
        if (!Schema::hasTable('notes')) {
            Schema::create('notes', function (Blueprint $table) {
                $table->id('id');
                $table->string('note_title');
                $table->longText('note_content')->nullable();
                $table->boolean('is_deleted')->default(false);
                $table->string('attachment')->nullable();
                $table->timestamps();
                // Add deleted_at column timestamps
                $table->softDeletes();
                // Define foreign keys
                $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade');
                $table->foreignId('category_id')->nullable()->constrained('categories', 'id')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notes');
    }
};
