<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleAgentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_agents', function (Blueprint $table) {
            $table->id(); 
            $table->string('name'); 
            $table->string('email')->unique(); 
            $table->string('password'); 
            $table->string('confirm_password'); 
            $table->timestamps(); 
            $table->boolean('is_deleted')->default(false); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_agents');
    }
}
