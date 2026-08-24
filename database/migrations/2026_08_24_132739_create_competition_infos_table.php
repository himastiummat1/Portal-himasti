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
        Schema::create('competition_infos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type'); // lomba, hackathon, sertifikasi
            $table->string('organizer');
            $table->text('description')->nullable();
            $table->string('link')->nullable();
            $table->date('deadline')->nullable();
            $table->string('poster')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_infos');
    }
};
