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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->nullable(); // MUST match companies.id
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->string('location')->nullable();
            $table->integer('salary_min')->nullable();
            $table->integer('salary_max')->nullable();
            $table->enum('job_type', ['full-time', 'part-time', 'contract', 'internship', 'remote'])->default('full-time');
            $table->enum('status', ['open', 'closed', 'draft'])->default('open');
            $table->date('deadline')->nullable();
            $table->timestamps();

             $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
