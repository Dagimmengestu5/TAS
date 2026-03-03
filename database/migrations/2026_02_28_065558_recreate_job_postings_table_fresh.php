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
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('job_postings');
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_requisition_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('tags')->nullable();
            $table->string('location')->nullable();
            $table->string('employment_type')->nullable();
            $table->boolean('is_internal')->default(false);
            $table->boolean('is_external')->default(false);
            $table->dateTime('deadline')->nullable();
            $table->string('status')->default('created'); // created, posted, closed
            $table->timestamps();
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
