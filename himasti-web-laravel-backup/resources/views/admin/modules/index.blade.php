<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Manajemen Bank Modul') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold">Daftar Modul & Snippet</h3>
                        <!-- Add Button -->
                        <button onclick="document.getElementById('addModal').classList.remove('hidden')" class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
                            + Tambah Modul
                        </button>
                    </div>

                    @if(session('success'))
                        <div class="mb-4 bg-green-100 text-green-700 p-3 rounded">
                            {{ session('success') }}
                        </div>
                    @endif

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="p-3 border-b">Kategori</th>
                                    <th class="p-3 border-b">Judul</th>
                                    <th class="p-3 border-b">Deskripsi</th>
                                    <th class="p-3 border-b">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($modules as $module)
                                <tr class="hover:bg-gray-50 border-b">
                                    <td class="p-3">
                                        <span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold">{{ $module->category }}</span>
                                    </td>
                                    <td class="p-3 font-semibold">{{ $module->title }}</td>
                                    <td class="p-3 text-sm text-gray-500">{{ Str::limit($module->description, 50) }}</td>
                                    <td class="p-3 flex gap-2">
                                        <button onclick="openEditModal({{ $module }})" class="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">Edit</button>
                                        <form action="{{ route('admin.modules.destroy', $module->id) }}" method="POST" onsubmit="return confirm('Hapus modul ini?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Hapus</button>
                                        </form>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4">
                        {{ $modules->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Modal -->
    <div id="addModal" class="fixed inset-0 bg-black/50 hidden flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">Tambah Modul Baru</h3>
            <form action="{{ route('admin.modules.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Judul</label>
                    <input type="text" name="title" class="w-full border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Kategori (Misal: Python, Laravel, UI/UX)</label>
                    <input type="text" name="category" class="w-full border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Deskripsi</label>
                    <textarea name="description" rows="3" class="w-full border-gray-300 rounded" required></textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Code Snippet (Opsional)</label>
                    <textarea name="code_snippet" rows="5" class="w-full border-gray-300 rounded font-mono text-sm placeholder-gray-400" placeholder="Masukkan kode di sini..."></textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">File Modul (Opsional, max 10MB)</label>
                    <input type="file" name="file_path" class="w-full border-gray-300">
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('addModal').classList.add('hidden')" class="px-4 py-2 bg-gray-300 rounded">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Modal -->
    <div id="editModal" class="fixed inset-0 bg-black/50 hidden flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">Edit Modul</h3>
            <form id="editForm" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Judul</label>
                    <input type="text" id="edit_title" name="title" class="w-full border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Kategori</label>
                    <input type="text" id="edit_category" name="category" class="w-full border-gray-300 rounded" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Deskripsi</label>
                    <textarea id="edit_description" name="description" rows="3" class="w-full border-gray-300 rounded" required></textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Code Snippet (Opsional)</label>
                    <textarea id="edit_code_snippet" name="code_snippet" rows="5" class="w-full border-gray-300 rounded font-mono text-sm"></textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">File Modul (Opsional)</label>
                    <input type="file" name="file_path" class="w-full border-gray-300">
                    <p class="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah file.</p>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('editModal').classList.add('hidden')" class="px-4 py-2 bg-gray-300 rounded">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openEditModal(module) {
            document.getElementById('editForm').action = `/admin/modules/${module.id}`;
            document.getElementById('edit_title').value = module.title;
            document.getElementById('edit_category').value = module.category;
            document.getElementById('edit_description').value = module.description;
            document.getElementById('edit_code_snippet').value = module.code_snippet || '';
            document.getElementById('editModal').classList.remove('hidden');
        }
    </script>
</x-app-layout>
