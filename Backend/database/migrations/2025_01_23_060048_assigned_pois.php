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
        Schema::create('assigned_pois', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('plan_id');
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('poi_id');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('group_id')
            ->references('id')
            ->on('groups')
            ->onDelete('cascade')
            ->onUpdate('cascade');
            $table->foreign('plan_id')
            ->references('id')
            ->on('regaykar_plans')
            ->onDelete('cascade')
            ->onUpdate('cascade');
            $table->foreign('poi_id')
            ->references('id')
            ->on('pois')
            ->onDelete('cascade')
            ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_pois');
    }
};
