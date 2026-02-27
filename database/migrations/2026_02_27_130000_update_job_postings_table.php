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
        Schema::table('job_postings', function (Blueprint $table) {
            // Fix missing columns from initial migration if they don't exist
            if (!Schema::hasColumn('job_postings', 'title')) {
                $table->string('title')->nullable()->after('job_requisition_id');
            }
            if (!Schema::hasColumn('job_postings', 'description')) {
                $table->text('description')->nullable()->after('title');
            }
            
            // Add new tagging and override fields
            $table->string('tags')->nullable()->after('description');
            $table->string('location')->nullable()->after('tags');
            $table->string('employment_type')->nullable()->after('location'); // full-time, part-time, hybrid, remote, contract
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropColumn(['tags', 'location', 'employment_type']);
            // We don't drop title/description here as they were supposed to be in the original migration
        });
    }
};
