<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuperAdmin\SuperAdminController;
use App\Http\Controllers\Admin\Kaderisasi\DataKaderController;
use App\Http\Controllers\Admin\Sekretariat\SuratMasukController;
use App\Http\Controllers\Kader\SuratKaderController;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get('/dashboard', function () {
    
    $kajians = \App\Models\Kajian::latest()->take(3)->get();
    $artikels = \App\Models\Artikel::where('status', 'Published')->latest()->take(3)->get();
    $surveys = \App\Models\Survey::where('status', 'Aktif')->latest()->take(3)->get();
    $merchandises = \App\Models\Merchandise::where('stok', '>', 0)->latest()->take(3)->get();
    $klubs = \App\Models\Klub::latest()->take(3)->get();
    $galeri_kaderisasi = \App\Models\GaleriKaderisasi::latest()->take(6)->get();
    $competitions = \App\Models\CompetitionInfo::where('deadline', '>=', now())->latest()->take(5)->get();
    
    // Get upcoming meetings/messages (hilang otomatis 1 hari setelah event_date berlalu)
    $meetings = \App\Models\Meeting::with('creator')
        ->where('event_date', '>=', now()->subDay())
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();

    return view('dashboard', compact('kajians', 'artikels', 'surveys', 'merchandises', 'klubs', 'galeri_kaderisasi', 'meetings', 'competitions'));
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/tentang', function () {
    return view('tentang');
})->name('tentang');

Route::get('/auth/google', function () {
    return \Laravel\Socialite\Facades\Socialite::driver('google')->redirect();
})->name('auth.google');

Route::get('/auth/google/callback', [\App\Http\Controllers\Auth\SocialiteController::class, 'handleGoogleCallback']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Group Auth Middleware untuk HIMASTI
Route::middleware(['auth'])->group(function () {
    
    // Group Role 'kader'
    Route::middleware(['role:kader'])->prefix('kader')->name('kader.')->group(function () {
        Route::get('/surat', [SuratKaderController::class, 'index'])->name('surat.index');
        Route::post('/surat', [SuratKaderController::class, 'store'])->name('surat.store');
    });

    // Group Role 'admin_sekretariat'
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|admin_sekretariat'])->prefix('sekretariat')->name('admin.sekretariat.')->group(function () {
        Route::get('/surat', [SuratMasukController::class, 'index'])->name('surat.index');
        Route::put('/surat/{surat}/approve', [SuratMasukController::class, 'approve'])->name('surat.approve');
        Route::put('/surat/{surat}/reject', [SuratMasukController::class, 'reject'])->name('surat.reject');
    });

    // Group Role 'admin_kaderisasi'
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|admin_kaderisasi|wakil_kaderisasi|anggota_kaderisasi'])->prefix('kaderisasi')->name('admin.kaderisasi.')->group(function () {
        Route::get('/data-kader/duplicates', [DataKaderController::class, 'duplicates'])->name('duplicates');
        Route::get('/data-kader', [DataKaderController::class, 'index'])->name('index');
        Route::post('/data-kader', [DataKaderController::class, 'store'])->name('store');
        Route::post('/data-kader/import', [DataKaderController::class, 'import'])->name('import');
        Route::put('/data-kader/{dataKader}', [DataKaderController::class, 'update'])->name('update');
        Route::delete('/data-kader/{dataKader}', [DataKaderController::class, 'destroy'])->name('destroy');
        
        // Galeri Kaderisasi
        Route::resource('galeri', \App\Http\Controllers\Admin\GaleriKaderisasiController::class)->only(['index', 'store', 'destroy']);
    });

    // Group Role 'super_admin' & others
    Route::middleware(['role:super_admin'])->prefix('superadmin')->name('superadmin.')->group(function () {
        Route::get('/dashboard', [SuperAdminController::class, 'index'])->name('dashboard');
        
        // User Management & Roles
        Route::get('/users', [SuperAdminController::class, 'users'])->name('users');
        Route::put('/users/{user}/assign-role', [SuperAdminController::class, 'assignRole'])->name('users.assign_role');
        
        // Impersonate
        Route::get('/impersonate/{userId}', [SuperAdminController::class, 'impersonate'])->name('impersonate');
        
        // Trash Restore/Force Delete
        Route::get('/trash', [SuperAdminController::class, 'trash'])->name('trash');
        Route::post('/trash/{id}/{type}/restore', [SuperAdminController::class, 'restore'])->name('trash.restore');
        Route::delete('/trash/{id}/{type}/force-delete', [SuperAdminController::class, 'forceDelete'])->name('trash.force_delete');

        // Audit Logs
        Route::get('/audit-logs', function () {
            return "Audit Logs (Implementasikan dengan spatie/laravel-activitylog)";
        })->name('audit_logs');
    });

    // Fitur Tambahan (Admin & Super Admin)
    Route::prefix('admin')->name('admin.')->group(function() {
        // Fitur Baru: Bank Modul & Katalog Karya (khusus Super Admin)
        Route::middleware(['role:super_admin'])->group(function () {
            Route::resource('modules', \App\Http\Controllers\Admin\ItModuleAdminController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource('projects', \App\Http\Controllers\Admin\StudentProjectAdminController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        Route::get('/events', [\App\Http\Controllers\EventController::class, 'index'])->name('events.index');
        Route::post('/events', [\App\Http\Controllers\EventController::class, 'store'])->name('events.store');

        Route::get('/absensi', [\App\Http\Controllers\AbsensiController::class, 'index'])->name('absensi.index');
        Route::post('/absensi', [\App\Http\Controllers\AbsensiController::class, 'store'])->name('absensi.store');

        Route::get('/keuangan', [\App\Http\Controllers\KeuanganController::class, 'index'])->name('keuangan.index');
        Route::post('/keuangan', [\App\Http\Controllers\KeuanganController::class, 'store'])->name('keuangan.store');
    });

    // Rute untuk kembali dari impersonate (Bisa diakses user biasa yang sedang di-impersonate)
    Route::get('/leave-impersonate', [SuperAdminController::class, 'leaveImpersonate'])->name('leave_impersonate');

    // New Modules Roles
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|kabid_kemuhammadiyahan|wakil_kemuhammadiyahan|anggota_kemuhammadiyahan'])->resource('kajian', \App\Http\Controllers\Admin\KajianController::class)->names('admin.kajian')->only(['index', 'store', 'destroy']);
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|kabid_keorganisasian|wakil_keorganisasian|anggota_keorganisasian'])->resource('notulensi', \App\Http\Controllers\Admin\NotulensiController::class)->names('admin.notulensi')->only(['index', 'store', 'destroy']);
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|kabid_metkom|wakil_metkom|anggota_metkom'])->resource('artikel', \App\Http\Controllers\Admin\ArtikelController::class)->names('admin.artikel')->only(['index', 'store', 'update', 'destroy']);
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|kabid_litbang|wakil_litbang|anggota_litbang'])->resource('survey', \App\Http\Controllers\Admin\SurveyController::class)->names('admin.survey')->only(['index', 'store', 'destroy']);
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|kabid_kewirausahaan|wakil_kewirausahaan|anggota_kewirausahaan'])->resource('merchandise', \App\Http\Controllers\Admin\MerchandiseController::class)->names('admin.merchandise')->only(['index', 'store', 'destroy']);
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|kabid_mikat|wakil_mikat|anggota_mikat'])->resource('klub', \App\Http\Controllers\Admin\KlubController::class)->names('admin.klub')->only(['index', 'store', 'destroy']);
    
    // Undangan Rapat / Pesan Sementara
    Route::post('meetings/{meeting}/resend', [\App\Http\Controllers\MeetingController::class, 'resend'])->name('admin.meetings.resend');
    Route::middleware(['role:super_admin|ketua_himpunan|wakil_ketua_himpunan|admin_sekretariat|bendahara|kabid_kemuhammadiyahan|kabid_keorganisasian|kabid_metkom|kabid_litbang|kabid_kewirausahaan|kabid_mikat|ketua_panitia_sementara'])->resource('meetings', \App\Http\Controllers\MeetingController::class)->names('admin.meetings')->only(['index', 'store', 'destroy']);

    // Rute cerdas untuk mengarahkan pengurus kembali ke panel mereka
    Route::get('/admin', function () {
        $user = auth()->user();
        if ($user->hasRole('super_admin')) return redirect()->route('superadmin.dashboard');
        if ($user->hasRole('ketua_himpunan') || $user->hasRole('wakil_ketua_himpunan')) return redirect()->route('admin.kajian.index');
        
        // Cek satu persatu
        if ($user->hasRole(['kabid_kemuhammadiyahan', 'wakil_kemuhammadiyahan', 'anggota_kemuhammadiyahan'])) return redirect()->route('admin.kajian.index');
        if ($user->hasRole(['kabid_keorganisasian', 'wakil_keorganisasian', 'anggota_keorganisasian'])) return redirect()->route('admin.notulensi.index');
        if ($user->hasRole(['kabid_metkom', 'wakil_metkom', 'anggota_metkom'])) return redirect()->route('admin.artikel.index');
        if ($user->hasRole(['kabid_litbang', 'wakil_litbang', 'anggota_litbang'])) return redirect()->route('admin.survey.index');
        if ($user->hasRole(['kabid_kewirausahaan', 'wakil_kewirausahaan', 'anggota_kewirausahaan'])) return redirect()->route('admin.merchandise.index');
        if ($user->hasRole(['kabid_mikat', 'wakil_mikat', 'anggota_mikat'])) return redirect()->route('admin.klub.index');
        if ($user->hasRole(['admin_kaderisasi', 'wakil_kaderisasi', 'anggota_kaderisasi'])) return redirect()->route('admin.kaderisasi.index');
        if ($user->hasRole(['admin_sekretariat'])) return redirect()->route('admin.sekretariat.surat.index');
        if ($user->hasRole(['ketua_panitia_sementara'])) return redirect()->route('admin.meetings.index');
        
        return redirect()->route('dashboard');
    })->name('admin.redirect');

});
// Fitur Baru HIMASTI
Route::get('/bank-modul', [\App\Http\Controllers\ItModuleController::class, 'index'])->name('modules.index');
Route::get('/bank-modul/kategori/{category}', [\App\Http\Controllers\ItModuleController::class, 'showCategory'])->name('modules.show');
Route::get('/bank-modul/download/{module}', [\App\Http\Controllers\ItModuleController::class, 'download'])->name('modules.download');

Route::prefix('devtools')->name('devtools.')->group(function () {
    Route::get('/', [\App\Http\Controllers\DevToolsController::class, 'index'])->name('index');
    Route::get('/json', [\App\Http\Controllers\DevToolsController::class, 'json'])->name('json');
    Route::get('/regex', [\App\Http\Controllers\DevToolsController::class, 'regex'])->name('regex');
    Route::get('/subnet', [\App\Http\Controllers\DevToolsController::class, 'subnet'])->name('subnet');
    Route::get('/markdown', [\App\Http\Controllers\DevToolsController::class, 'markdown'])->name('markdown');
});

Route::get('/karya', [\App\Http\Controllers\StudentProjectController::class, 'index'])->name('projects.index');
Route::get('/karya/{project}', [\App\Http\Controllers\StudentProjectController::class, 'show'])->name('projects.show');

Route::get('/info-lomba', [\App\Http\Controllers\CompetitionInfoController::class, 'index'])->name('competitions.index');
Route::get('/info-lomba/{competition}', [\App\Http\Controllers\CompetitionInfoController::class, 'show'])->name('competitions.show');

// AI Chatbot Route
Route::post('/chat/ask', [\App\Http\Controllers\GroqChatController::class, 'ask'])->name('chat.ask')->middleware('auth');

require __DIR__.'/auth.php';
