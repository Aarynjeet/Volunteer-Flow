<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('volunteers', function (Blueprint $table) {
            $table->text('bio')->nullable()->after('location');
            $table->text('experience')->nullable()->after('bio');
            $table->string('resume_url')->nullable()->after('emergency_contact');
            $table->string('resume_file_name')->nullable()->after('resume_url');
        });
    }

    public function down(): void
    {
        Schema::table('volunteers', function (Blueprint $table) {
            $table->dropColumn([
                'bio',
                'experience',
                'resume_url',
                'resume_file_name',
            ]);
        });
    }
};

