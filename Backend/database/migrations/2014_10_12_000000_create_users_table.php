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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('server_id')->nullable();
            $table->string('mobile_number')->nullable();
            $table->string('address')->nullable();
            $table->enum('role', ['superadmin', 'admin', 'user'])->default('user');
            $table->text('api_key')->nullable()->unique();
            $table->rememberToken();
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable(); // Soft delete (nullable)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
