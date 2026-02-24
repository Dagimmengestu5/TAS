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
        Schema::create('job_requisitions', function (Illuminate\Database\Schema\Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('department');
            $table->string('budget_status')->default('pending');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Hiring Manager
            $table->string('jd_path')->nullable(); // Path to attached JD PDF
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_requisitions');
    }
};
