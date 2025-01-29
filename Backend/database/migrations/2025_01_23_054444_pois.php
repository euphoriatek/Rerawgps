<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pois', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('description', 255);
            $table->integer('map_icon_id')->nullable();
            $table->integer('poi_id')->nullable();
            $table->unsignedBigInteger('regaykar_user_id');
            $table->longText('coordinates')->charset('utf8mb4')->collation('utf8mb4_bin');
            $table->tinyInteger('active')->default(0);
            $table->timestamps();
            $table->enum('status', ['pending', 'reject', 'approved'])->default('pending');
            $table->foreign('regaykar_user_id')
            ->references('id')
            ->on('users')
            ->onDelete('cascade')
            ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pois');
    }
};
