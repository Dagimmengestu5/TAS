<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_requisitions', function (Blueprint $table) {
            $table->string('category')->nullable()->after('department');
            $table->string('location')->nullable()->after('category');
            $table->string('employment_type')->nullable()->after('location'); // full-time, part-time, hybrid, remote, contract
        });
    }

    public function down(): void
    {
        Schema::table('job_requisitions', function (Blueprint $table) {
            $table->dropColumn(['category', 'location', 'employment_type']);
        });
    }
};
