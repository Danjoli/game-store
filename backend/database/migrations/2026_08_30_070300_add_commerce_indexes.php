<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', fn (Blueprint $table) => $table->index(['active', 'featured']));
        Schema::table('orders', fn (Blueprint $table) => $table->index(['status', 'created_at']));
        Schema::table('addresses', fn (Blueprint $table) => $table->index(['user_id', 'is_default']));
    }

    public function down(): void
    {
        Schema::table('games', fn (Blueprint $table) => $table->dropIndex(['active', 'featured']));
        Schema::table('orders', fn (Blueprint $table) => $table->dropIndex(['status', 'created_at']));
        Schema::table('addresses', fn (Blueprint $table) => $table->dropIndex(['user_id', 'is_default']));
    }
};
