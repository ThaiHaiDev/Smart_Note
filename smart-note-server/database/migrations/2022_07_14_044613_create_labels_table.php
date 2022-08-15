<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
        // Create labels table if not exists
        if (!Schema::hasTable('labels')) {
            Schema::create('labels', function (Blueprint $table) {
                $table->id('id');
                $table->string('label_name');
                $table->timestamps();
                // Define foreign keys
                $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade');
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
        Schema::dropIfExists('labels');
    }
};
