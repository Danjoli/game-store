<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table): void {
            $table->unsignedInteger('stock')->nullable()->after('featured');
            $table->string('download_url')->nullable()->after('stock');
            $table->boolean('active')->default(true)->after('download_url');
        });
        Schema::table('orders', function (Blueprint $table): void {
            $table->string('payment_id')->nullable()->unique()->after('payment_method');
            $table->string('payment_url')->nullable()->after('payment_id');
            $table->timestamp('paid_at')->nullable()->after('payment_url');
            $table->timestamp('cancelled_at')->nullable()->after('paid_at');
            $table->timestamp('refunded_at')->nullable()->after('cancelled_at');
            $table->string('coupon_code')->nullable()->after('refunded_at');
            $table->decimal('discount', 10, 2)->default(0)->after('coupon_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', fn (Blueprint $table) => $table->dropColumn(['payment_id', 'payment_url', 'paid_at', 'cancelled_at', 'refunded_at', 'coupon_code', 'discount']));
        Schema::table('games', fn (Blueprint $table) => $table->dropColumn(['stock', 'download_url', 'active']));
    }
};
