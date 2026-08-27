<?php

$modules = [
    'Kajian' => ['role' => 'kabid_kemuhammadiyahan', 'icon' => 'book-open', 'title' => 'Kajian & Dakwah'],
    'Notulensi' => ['role' => 'kabid_keorganisasian', 'icon' => 'file-text', 'title' => 'Rapat & Notulensi'],
    'Artikel' => ['role' => 'kabid_metkom', 'icon' => 'globe', 'title' => 'Publikasi Artikel'],
    'Survey' => ['role' => 'kabid_litbang', 'icon' => 'bar-chart-2', 'title' => 'Survey & Polling'],
    'Merchandise' => ['role' => 'kabid_kewirausahaan', 'icon' => 'shopping-bag', 'title' => 'Merchandise'],
    'Klub' => ['role' => 'kabid_mikat', 'icon' => 'music', 'title' => 'Klub & Minat Bakat'],
];

foreach ($modules as $model => $config) {
    $role = $config['role'];
    $icon = $config['icon'];
    $title = $config['title'];
    $routePrefix = strtolower($model);
    $viewDir = "resources/views/admin/{$routePrefix}";

    // Create View Dir
    if (!is_dir($viewDir)) {
        mkdir($viewDir, 0755, true);
    }

    // 1. Controller Content
    $controllerContent = "<?php\n\namespace App\Http\Controllers\Admin;\n\nuse App\Http\Controllers\Controller;\nuse Illuminate\Http\Request;\nuse App\Models\\$model;\n\nclass {$model}Controller extends Controller\n{\n    public function index()\n    {\n        \$items = $model::latest()->get();\n        return view('admin.{$routePrefix}.index', compact('items'));\n    }\n\n    public function store(Request \$request)\n    {\n        \$request->validate(['title' => 'required|string', 'description' => 'required|string']);\n        $model::create(\$request->all());\n        return back()->with('success', 'Data berhasil ditambahkan!');\n    }\n\n    public function destroy(\$id)\n    {\n        $model::findOrFail(\$id)->delete();\n        return back()->with('success', 'Data berhasil dihapus!');\n    }\n}\n";
    file_put_contents("app/Http/Controllers/Admin/{$model}Controller.php", $controllerContent);

    // 2. View Content
    $viewContent = "@extends('layouts.admin')\n@section('title', '$title')\n\n@section('content')\n<div class=\"mb-6 flex justify-between items-center\">\n    <h2 class=\"text-2xl font-bold text-slate-800\"><i data-lucide=\"$icon\" class=\"w-6 h-6 inline-block mr-2\"></i> $title</h2>\n</div>\n\n<div class=\"grid md:grid-cols-3 gap-6\">\n    <div class=\"md:col-span-1\">\n        <div class=\"glass-panel p-6 rounded-2xl border border-slate-200\">\n            <h3 class=\"font-bold text-lg mb-4\">Tambah Data Baru</h3>\n            <form action=\"{{ route('admin.$routePrefix.store') }}\" method=\"POST\">\n                @csrf\n                <div class=\"mb-4\">\n                    <label class=\"block text-sm font-medium mb-1\">Judul / Nama</label>\n                    <input type=\"text\" name=\"title\" required class=\"w-full rounded-lg border-slate-300\">\n                </div>\n                <div class=\"mb-4\">\n                    <label class=\"block text-sm font-medium mb-1\">Deskripsi / Catatan</label>\n                    <textarea name=\"description\" required class=\"w-full rounded-lg border-slate-300\" rows=\"4\"></textarea>\n                </div>\n                <button type=\"submit\" class=\"w-full py-2 bg-blue-600 text-white rounded-lg\">Simpan Data</button>\n            </form>\n        </div>\n    </div>\n    <div class=\"md:col-span-2\">\n        <div class=\"glass-panel p-6 rounded-2xl border border-slate-200\">\n            <table class=\"w-full text-left\">\n                <thead>\n                    <tr class=\"border-b\">\n                        <th class=\"py-2\">Judul</th>\n                        <th class=\"py-2\">Deskripsi</th>\n                        <th class=\"py-2\">Aksi</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    @foreach(\$items as \$item)\n                    <tr class=\"border-b\">\n                        <td class=\"py-2\">{{ \$item->title }}</td>\n                        <td class=\"py-2\">{{ Str::limit(\$item->description, 50) }}</td>\n                        <td class=\"py-2\">\n                            <form action=\"{{ route('admin.$routePrefix.destroy', \$item->id) }}\" method=\"POST\">\n                                @csrf\n                                @method('DELETE')\n                                <button type=\"submit\" class=\"text-red-500 hover:text-red-700 text-sm\">Hapus</button>\n                            </form>\n                        </td>\n                    </tr>\n                    @endforeach\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n@endsection\n";
    file_put_contents("$viewDir/index.blade.php", $viewContent);
}

echo "Scaffolding Complete!\n";
