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
        Schema::create('student_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('student_name');
            $table->string('category'); // web, mobile, script, ui/ux
            $table->text('description')->nullable();
            $table->string('screenshot')->nullable();
            $table->string('github_link')->nullable();
            $table->string('demo_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_projects');
    }
};
