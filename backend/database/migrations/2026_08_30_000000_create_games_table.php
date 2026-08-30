<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('title')->unique();
            $table->string('slug')->unique();
            $table->string('studio');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('old_price', 10, 2)->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->string('label')->nullable();
            $table->string('art');
            $table->boolean('featured')->default(false);
            $table->timestamps();

            $table->index(['featured', 'title']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
