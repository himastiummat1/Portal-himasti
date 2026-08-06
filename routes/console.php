<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('fix:tables', function () {
    Schema::dropIfExists('kajians');
    Schema::create('kajians', function (Blueprint $table) {
        $table->id();
        $table->string('tema'); $table->string('pemateri'); $table->date('tanggal'); $table->string('lokasi'); $table->enum('status', ['Akan Datang', 'Selesai'])->default('Akan Datang'); $table->text('deskripsi');
        $table->timestamps();
    });
    Schema::dropIfExists('notulensis');
    Schema::create('notulensis', function (Blueprint $table) {
        $table->id();
        $table->string('agenda'); $table->date('tanggal'); $table->string('pemimpin_rapat'); $table->text('hasil_rapat'); $table->integer('jumlah_hadir');
        $table->timestamps();
    });
    Schema::dropIfExists('artikels');
    Schema::create('artikels', function (Blueprint $table) {
        $table->id();
        $table->string('judul'); $table->string('penulis'); $table->text('konten'); $table->enum('status', ['Draft', 'Published'])->default('Draft');
        $table->timestamps();
    });
    Schema::dropIfExists('surveys');
    Schema::create('surveys', function (Blueprint $table) {
        $table->id();
        $table->string('judul'); $table->string('link_gform'); $table->integer('target_responden'); $table->enum('status', ['Aktif', 'Ditutup'])->default('Aktif'); $table->text('deskripsi')->nullable();
        $table->timestamps();
    });
    Schema::dropIfExists('merchandises');
    Schema::create('merchandises', function (Blueprint $table) {
        $table->id();
        $table->string('nama_barang'); $table->integer('harga'); $table->integer('stok'); $table->text('deskripsi');
        $table->timestamps();
    });
    Schema::dropIfExists('klubs');
    Schema::create('klubs', function (Blueprint $table) {
        $table->id();
        $table->string('nama_klub'); $table->string('ketua_klub'); $table->string('jadwal_latihan'); $table->text('deskripsi');
        $table->timestamps();
    });

    $this->info('Tables recreated successfully!');
});
