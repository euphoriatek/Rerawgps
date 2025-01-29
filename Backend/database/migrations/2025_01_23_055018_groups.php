<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id(); 
            $table->string('name');
            $table->text('description'); 
            $table->longText('pois_id')->charset('utf8mb4')->collation('utf8mb4_bin'); 
            $table->unsignedBigInteger('user_id');
            $table->timestamps(); 
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        // Add check constraint using raw SQL
        DB::statement('ALTER TABLE groups ADD CONSTRAINT check_pois_id_json_valid CHECK (JSON_VALID(pois_id))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
