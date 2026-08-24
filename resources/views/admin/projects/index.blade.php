<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Manajemen Katalog Karya') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold">Daftar Karya Mahasiswa</h3>
                        <button onclick="document.getElementById('addModal').classList.remove('hidden')" class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
                            + Tambah Karya
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
                                    <th class="p-3 border-b">Thumbnail</th>
                                    <th class="p-3 border-b">Judul</th>
                                    <th class="p-3 border-b">Pembuat</th>
                                    <th class="p-3 border-b">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($projects as $project)
                                <tr class="hover:bg-gray-50 border-b">
                                    <td class="p-3">
                                        @if($project->thumbnail)
                                            <img src="{{ asset('storage/'.$project->thumbnail) }}" class="w-16 h-16 object-cover rounded">
                                        @else
                                            <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                                        @endif
                                    </td>
                                    <td class="p-3 font-semibold">{{ $project->title }}</td>
                                    <td class="p-3">
                                        <div class="font-bold">{{ $project->student_name }}</div>
                                        <div class="text-xs text-gray-500">{{ $project->nim }} • {{ $project->batch }}</div>
                                    </td>
                                    <td class="p-3 flex gap-2">
                                        <button onclick='openEditModal(@json($project))' class="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">Edit</button>
                                        <form action="{{ route('admin.projects.destroy', $project->id) }}" method="POST" onsubmit="return confirm('Hapus karya ini?')">
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
                        {{ $projects->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Modal -->
    <div id="addModal" class="fixed inset-0 bg-black/50 hidden flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">Tambah Karya Baru</h3>
            <form action="{{ route('admin.projects.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="grid grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Judul Karya</label>
                        <input type="text" name="title" class="w-full border-gray-300 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Nama Pembuat</label>
                        <input type="text" name="student_name" class="w-full border-gray-300 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">NIM</label>
                        <input type="text" name="nim" class="w-full border-gray-300 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Angkatan (Misal: 2021)</label>
                        <input type="text" name="batch" class="w-full border-gray-300 rounded" required>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Deskripsi</label>
                    <textarea name="description" rows="3" class="w-full border-gray-300 rounded" required></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Link GitHub (Opsional)</label>
                        <input type="url" name="github_link" class="w-full border-gray-300 rounded placeholder-gray-400" placeholder="https://github.com/...">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Link Demo (Opsional)</label>
                        <input type="url" name="demo_link" class="w-full border-gray-300 rounded placeholder-gray-400" placeholder="https://...">
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Thumbnail / Screenshot (Opsional)</label>
                    <input type="file" name="thumbnail" accept="image/*" class="w-full border-gray-300">
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
            <h3 class="text-xl font-bold mb-4">Edit Karya</h3>
            <form id="editForm" method="POST" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <div class="grid grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Judul Karya</label>
                        <input type="text" id="edit_title" name="title" class="w-full border-gray-300 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Nama Pembuat</label>
                        <input type="text" id="edit_student_name" name="student_name" class="w-full border-gray-300 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">NIM</label>
                        <input type="text" id="edit_nim" name="nim" class="w-full border-gray-300 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Angkatan</label>
                        <input type="text" id="edit_batch" name="batch" class="w-full border-gray-300 rounded" required>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Deskripsi</label>
                    <textarea id="edit_description" name="description" rows="3" class="w-full border-gray-300 rounded" required></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Link GitHub</label>
                        <input type="url" id="edit_github_link" name="github_link" class="w-full border-gray-300 rounded">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-2">Link Demo</label>
                        <input type="url" id="edit_demo_link" name="demo_link" class="w-full border-gray-300 rounded">
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">Ganti Thumbnail</label>
                    <input type="file" name="thumbnail" accept="image/*" class="w-full border-gray-300">
                    <p class="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah gambar.</p>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('editModal').classList.add('hidden')" class="px-4 py-2 bg-gray-300 rounded">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openEditModal(project) {
            document.getElementById('editForm').action = `/admin/projects/${project.id}`;
            document.getElementById('edit_title').value = project.title;
            document.getElementById('edit_student_name').value = project.student_name;
            document.getElementById('edit_nim').value = project.nim;
            document.getElementById('edit_batch').value = project.batch;
            document.getElementById('edit_description').value = project.description;
            document.getElementById('edit_github_link').value = project.github_link || '';
            document.getElementById('edit_demo_link').value = project.demo_link || '';
            document.getElementById('editModal').classList.remove('hidden');
        }
    </script>
</x-app-layout>
