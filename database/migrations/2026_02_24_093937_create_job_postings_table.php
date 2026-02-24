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
        Schema::create('job_postings', function (Illuminate\Database\Schema\Blueprint $table) {
            $table->id();
            $table->foreignId('job_requisition_id')->constrained()->onDelete('cascade');
            $table->boolean('is_internal')->default(false);
            $table->boolean('is_external')->default(false);
            $table->dateTime('deadline')->nullable();
            $table->string('status')->default('active'); // active, closed, draft
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
