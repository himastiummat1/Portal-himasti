<?php

$modules = [
    'Kajian' => [
        'table' => 'kajians',
        'fields' => ['tema', 'pemateri', 'tanggal', 'lokasi', 'status', 'deskripsi'],
        'migration' => "\$table->string('tema'); \$table->string('pemateri'); \$table->date('tanggal'); \$table->string('lokasi'); \$table->enum('status', ['Akan Datang', 'Selesai'])->default('Akan Datang'); \$table->text('deskripsi');",
        'validation' => "'tema' => 'required', 'pemateri' => 'required', 'tanggal' => 'required|date', 'lokasi' => 'required', 'status' => 'required', 'deskripsi' => 'required'",
        'form' => "
            <div class='mb-3'><label class='text-sm font-medium'>Tema Kajian</label><input type='text' name='tema' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Pemateri / Ustadz</label><input type='text' name='pemateri' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Tanggal</label><input type='date' name='tanggal' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Lokasi</label><input type='text' name='lokasi' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Status</label><select name='status' class='w-full rounded-lg border-slate-300'><option>Akan Datang</option><option>Selesai</option></select></div>
            <div class='mb-3'><label class='text-sm font-medium'>Deskripsi Singkat</label><textarea name='deskripsi' required class='w-full rounded-lg border-slate-300'></textarea></div>
        ",
        'table_headers' => "<th class='py-2'>Tema</th><th class='py-2'>Pemateri</th><th class='py-2'>Tanggal</th><th class='py-2'>Status</th>",
        'table_rows' => "<td class='py-2'>{{ \$item->tema }}</td><td class='py-2'>{{ \$item->pemateri }}</td><td class='py-2'>{{ \$item->tanggal }}</td><td class='py-2'>{{ \$item->status }}</td>"
    ],
    'Notulensi' => [
        'table' => 'notulensis',
        'fields' => ['agenda', 'tanggal', 'pemimpin_rapat', 'hasil_rapat', 'jumlah_hadir'],
        'migration' => "\$table->string('agenda'); \$table->date('tanggal'); \$table->string('pemimpin_rapat'); \$table->text('hasil_rapat'); \$table->integer('jumlah_hadir');",
        'validation' => "'agenda' => 'required', 'tanggal' => 'required|date', 'pemimpin_rapat' => 'required', 'hasil_rapat' => 'required', 'jumlah_hadir' => 'required|numeric'",
        'form' => "
            <div class='mb-3'><label class='text-sm font-medium'>Agenda Rapat</label><input type='text' name='agenda' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Tanggal</label><input type='date' name='tanggal' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Pemimpin Rapat</label><input type='text' name='pemimpin_rapat' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Jumlah Hadir</label><input type='number' name='jumlah_hadir' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Hasil/Kesimpulan Rapat</label><textarea name='hasil_rapat' required class='w-full rounded-lg border-slate-300' rows='4'></textarea></div>
        ",
        'table_headers' => "<th class='py-2'>Agenda</th><th class='py-2'>Tanggal</th><th class='py-2'>Hadir</th><th class='py-2'>Pemimpin</th>",
        'table_rows' => "<td class='py-2'>{{ \$item->agenda }}</td><td class='py-2'>{{ \$item->tanggal }}</td><td class='py-2'>{{ \$item->jumlah_hadir }} Org</td><td class='py-2'>{{ \$item->pemimpin_rapat }}</td>"
    ],
    'Artikel' => [
        'table' => 'artikels',
        'fields' => ['judul', 'penulis', 'konten', 'status'],
        'migration' => "\$table->string('judul'); \$table->string('penulis'); \$table->text('konten'); \$table->enum('status', ['Draft', 'Published'])->default('Draft');",
        'validation' => "'judul' => 'required', 'penulis' => 'required', 'konten' => 'required', 'status' => 'required'",
        'form' => "
            <div class='mb-3'><label class='text-sm font-medium'>Judul Artikel</label><input type='text' name='judul' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Penulis</label><input type='text' name='penulis' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Status</label><select name='status' class='w-full rounded-lg border-slate-300'><option>Draft</option><option>Published</option></select></div>
            <div class='mb-3'><label class='text-sm font-medium'>Konten Artikel</label><textarea name='konten' required class='w-full rounded-lg border-slate-300' rows='6'></textarea></div>
        ",
        'table_headers' => "<th class='py-2'>Judul</th><th class='py-2'>Penulis</th><th class='py-2'>Status</th>",
        'table_rows' => "<td class='py-2'>{{ \$item->judul }}</td><td class='py-2'>{{ \$item->penulis }}</td><td class='py-2'>{{ \$item->status }}</td>"
    ],
    'Survey' => [
        'table' => 'surveys',
        'fields' => ['judul', 'link_gform', 'target_responden', 'status', 'deskripsi'],
        'migration' => "\$table->string('judul'); \$table->string('link_gform'); \$table->integer('target_responden'); \$table->enum('status', ['Aktif', 'Ditutup'])->default('Aktif'); \$table->text('deskripsi')->nullable();",
        'validation' => "'judul' => 'required', 'link_gform' => 'required|url', 'target_responden' => 'required|numeric', 'status' => 'required'",
        'form' => "
            <div class='mb-3'><label class='text-sm font-medium'>Judul Survey/Polling</label><input type='text' name='judul' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Link Google Form</label><input type='url' name='link_gform' required placeholder='https://forms.gle/...' class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Target Responden (Jumlah)</label><input type='number' name='target_responden' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Status</label><select name='status' class='w-full rounded-lg border-slate-300'><option>Aktif</option><option>Ditutup</option></select></div>
            <div class='mb-3'><label class='text-sm font-medium'>Deskripsi Tujuan</label><textarea name='deskripsi' class='w-full rounded-lg border-slate-300'></textarea></div>
        ",
        'table_headers' => "<th class='py-2'>Judul Survey</th><th class='py-2'>Link</th><th class='py-2'>Target</th><th class='py-2'>Status</th>",
        'table_rows' => "<td class='py-2'>{{ \$item->judul }}</td><td class='py-2'><a href='{{ \$item->link_gform }}' target='_blank' class='text-blue-500 underline'>Buka Form</a></td><td class='py-2'>{{ \$item->target_responden }}</td><td class='py-2'>{{ \$item->status }}</td>"
    ],
    'Merchandise' => [
        'table' => 'merchandises',
        'fields' => ['nama_barang', 'harga', 'stok', 'deskripsi'],
        'migration' => "\$table->string('nama_barang'); \$table->integer('harga'); \$table->integer('stok'); \$table->text('deskripsi');",
        'validation' => "'nama_barang' => 'required', 'harga' => 'required|numeric', 'stok' => 'required|numeric', 'deskripsi' => 'required'",
        'form' => "
            <div class='mb-3'><label class='text-sm font-medium'>Nama Barang / Produk</label><input type='text' name='nama_barang' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Harga Jual (Rp)</label><input type='number' name='harga' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Stok Tersedia</label><input type='number' name='stok' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Deskripsi Produk</label><textarea name='deskripsi' required class='w-full rounded-lg border-slate-300'></textarea></div>
        ",
        'table_headers' => "<th class='py-2'>Nama Produk</th><th class='py-2'>Harga</th><th class='py-2'>Stok</th>",
        'table_rows' => "<td class='py-2'>{{ \$item->nama_barang }}</td><td class='py-2'>Rp {{ number_format(\$item->harga, 0, ',', '.') }}</td><td class='py-2'>{{ \$item->stok }} Pcs</td>"
    ],
    'Klub' => [
        'table' => 'klubs',
        'fields' => ['nama_klub', 'ketua_klub', 'jadwal_latihan', 'deskripsi'],
        'migration' => "\$table->string('nama_klub'); \$table->string('ketua_klub'); \$table->string('jadwal_latihan'); \$table->text('deskripsi');",
        'validation' => "'nama_klub' => 'required', 'ketua_klub' => 'required', 'jadwal_latihan' => 'required', 'deskripsi' => 'required'",
        'form' => "
            <div class='mb-3'><label class='text-sm font-medium'>Nama Klub (Mikat)</label><input type='text' name='nama_klub' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Ketua/Koordinator Klub</label><input type='text' name='ketua_klub' required class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Jadwal Latihan Rutin</label><input type='text' name='jadwal_latihan' required placeholder='Contoh: Jumat, 16.00 WIB' class='w-full rounded-lg border-slate-300'></div>
            <div class='mb-3'><label class='text-sm font-medium'>Deskripsi Kegiatan</label><textarea name='deskripsi' required class='w-full rounded-lg border-slate-300'></textarea></div>
        ",
        'table_headers' => "<th class='py-2'>Klub</th><th class='py-2'>Koordinator</th><th class='py-2'>Jadwal</th>",
        'table_rows' => "<td class='py-2'>{{ \$item->nama_klub }}</td><td class='py-2'>{{ \$item->ketua_klub }}</td><td class='py-2'>{{ \$item->jadwal_latihan }}</td>"
    ]
];

foreach ($modules as $model => $config) {
    // 1. UPDATE MODEL
    $fieldsStr = "'" . implode("', '", $config['fields']) . "'";
    $modelContent = "<?php\nnamespace App\Models;\nuse Illuminate\Database\Eloquent\Model;\nclass $model extends Model\n{\n    protected \$fillable = [$fieldsStr];\n}\n";
    file_put_contents("app/Models/$model.php", $modelContent);

    // 2. UPDATE CONTROLLER
    $validationStr = $config['validation'];
    $routePrefix = strtolower($model);
    $controllerContent = "<?php\nnamespace App\Http\Controllers\Admin;\n\nuse App\Http\Controllers\Controller;\nuse Illuminate\Http\Request;\nuse App\Models\\$model;\n\nclass {$model}Controller extends Controller\n{\n    public function index()\n    {\n        \$items = $model::latest()->get();\n        return view('admin.{$routePrefix}.index', compact('items'));\n    }\n\n    public function store(Request \$request)\n    {\n        \$request->validate([$validationStr]);\n        $model::create(\$request->only([" . $fieldsStr . "]));\n        return back()->with('success', 'Data berhasil ditambahkan!');\n    }\n\n    public function destroy(\$id)\n    {\n        $model::findOrFail(\$id)->delete();\n        return back()->with('success', 'Data berhasil dihapus!');\n    }\n}\n";
    file_put_contents("app/Http/Controllers/Admin/{$model}Controller.php", $controllerContent);

    // 3. UPDATE VIEW (Injecting the forms and table headers)
    $viewPath = "resources/views/admin/{$routePrefix}/index.blade.php";
    $viewContent = file_get_contents($viewPath);
    // Remove the old form and table rows via regex or string manipulation
    // The easiest way is to rewrite the whole view file based on the previous template
    $title = ""; // Extract title from old view
    preg_match("/@section\('title', '(.*?)'\)/", $viewContent, $matches);
    $title = $matches[1] ?? $model;
    
    // Extract icon
    preg_match('/data-lucide="(.*?)"/', $viewContent, $matches);
    $icon = $matches[1] ?? 'box';

    $newViewContent = "@extends('layouts.admin')\n@section('title', '$title')\n\n@section('content')\n<div class=\"mb-6 flex justify-between items-center\">\n    <h2 class=\"text-2xl font-bold text-slate-800\"><i data-lucide=\"$icon\" class=\"w-6 h-6 inline-block mr-2\"></i> $title</h2>\n</div>\n\n<div class=\"grid md:grid-cols-3 gap-6\">\n    <div class=\"md:col-span-1\">\n        <div class=\"glass-panel p-6 rounded-2xl border border-slate-200\">\n            <h3 class=\"font-bold text-lg mb-4\">Tambah Data Baru</h3>\n            <form action=\"{{ route('admin.$routePrefix.store') }}\" method=\"POST\">\n                @csrf\n                " . $config['form'] . "\n                <button type=\"submit\" class=\"w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700\">Simpan Data</button>\n            </form>\n        </div>\n    </div>\n    <div class=\"md:col-span-2\">\n        <div class=\"glass-panel p-6 rounded-2xl border border-slate-200 overflow-x-auto\">\n            <table class=\"w-full text-left\">\n                <thead>\n                    <tr class=\"border-b text-slate-600\">\n                        " . $config['table_headers'] . "\n                        <th class=\"py-2\">Aksi</th>\n                    </tr>\n                </thead>\n                <tbody class=\"text-sm\">\n                    @foreach(\$items as \$item)\n                    <tr class=\"border-b hover:bg-slate-50\">\n                        " . $config['table_rows'] . "\n                        <td class=\"py-2\">\n                            <form action=\"{{ route('admin.$routePrefix.destroy', \$item->id) }}\" method=\"POST\" onsubmit=\"return confirm('Yakin ingin menghapus?');\">\n                                @csrf\n                                @method('DELETE')\n                                <button type=\"submit\" class=\"text-red-500 hover:text-red-700 font-medium\"><i data-lucide=\"trash-2\" class=\"w-4 h-4\"></i></button>\n                            </form>\n                        </td>\n                    </tr>\n                    @endforeach\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n@endsection\n";
    file_put_contents($viewPath, $newViewContent);
}

// 4. Generate a specialized PHP script to drop & recreate the migration tables properly.
$migrationFixer = "<?php\nuse Illuminate\Support\Facades\Schema;\nuse Illuminate\Database\Schema\Blueprint;\n";
foreach ($modules as $model => $config) {
    $table = $config['table'];
    $migContent = $config['migration'];
    $migrationFixer .= "Schema::dropIfExists('$table');\n";
    $migrationFixer .= "Schema::create('$table', function (Blueprint \$table) {\n    \$table->id();\n    $migContent\n    \$table->timestamps();\n});\n";
}
file_put_contents('routes/console.php', "\nArtisan::command('fix:tables', function () {\n" . $migrationFixer . "\n    \$this->info('Tables recreated successfully!');\n});\n", FILE_APPEND);

echo "Module Expansion Complete!\n";
