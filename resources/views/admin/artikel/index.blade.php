@extends('layouts.admin')
@section('title', 'Postingan Medsos')

@section('content')
<div class="mb-6 flex justify-between items-center">
    <h2 class="text-2xl font-bold text-slate-800"><i data-lucide="instagram" class="w-6 h-6 inline-block mr-2"></i> Postingan Medsos (Metkom)</h2>
</div>

<div x-data="{
    editMode: false,
    formAction: '{{ route('admin.artikel.store') }}',
    formData: { id: null, judul: '', penulis: '', status: 'Draft', konten: '', link: '' },
    editItem(item) {
        this.editMode = true;
        this.formAction = '/admin/artikel/' + item.id;
        this.formData = {
            judul: item.judul,
            penulis: item.penulis,
            status: item.status,
            konten: item.konten,
            link: item.link || ''
        };
        window.scrollTo({top: 0, behavior: 'smooth'});
    },
    cancelEdit() {
        this.editMode = false;
        this.formAction = '{{ route('admin.artikel.store') }}';
        this.formData = { judul: '', penulis: '', status: 'Draft', konten: '', link: '' };
    }
}">
<div class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-1">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200">
            <h3 class="font-bold text-lg mb-4" x-text="editMode ? 'Edit Postingan' : 'Buat Postingan Baru'"></h3>
            <form :action="formAction" method="POST">
                @csrf
                <template x-if="editMode">
                    @method('PUT')
                </template>
                
                <div class='mb-3'><label class='text-sm font-medium'>Judul / Topik Postingan</label><input type='text' name='judul' x-model="formData.judul" required class='w-full rounded-lg border-slate-300'></div>
                <div class='mb-3'><label class='text-sm font-medium'>Platform (IG, TikTok, X, Website)</label><input type='text' name='penulis' x-model="formData.penulis" required placeholder='Contoh: Instagram' class='w-full rounded-lg border-slate-300'></div>
                <div class='mb-3'><label class='text-sm font-medium'>Link Postingan</label><input type='url' name='link' x-model="formData.link" placeholder='https://instagram.com/...' class='w-full rounded-lg border-slate-300'></div>
                <div class='mb-3'>
                    <label class='text-sm font-medium'>Status Tayang</label>
                    <select name='status' x-model="formData.status" class='w-full rounded-lg border-slate-300'>
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
                </div>
                <div class='mb-3'><label class='text-sm font-medium'>Caption / Teks Konten</label><textarea name='konten' x-model="formData.konten" required class='w-full rounded-lg border-slate-300' rows='6'></textarea></div>
            
                <div class="flex gap-2">
                    <button type="submit" class="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors" x-text="editMode ? 'Simpan Perubahan' : 'Simpan Postingan'"></button>
                    <button type="button" x-show="editMode" @click="cancelEdit" class="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors">Batal</button>
                </div>
            </form>
        </div>
    </div>
    <div class="md:col-span-2">
        <div class="glass-panel p-6 rounded-2xl border border-slate-200 overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b text-slate-600">
                        <th class='py-2'>Topik Postingan</th><th class='py-2'>Platform</th><th class='py-2'>Status</th>
                        <th class="py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    @foreach($items as $item)
                    <tr class="border-b hover:bg-slate-50">
                        <td class='py-2'>
                            {{ $item->judul }}
                            @if($item->link)
                                <a href="{{ $item->link }}" target="_blank" class="block text-xs text-blue-500 hover:underline mt-1"><i data-lucide="external-link" class="w-3 h-3 inline-block"></i> Lihat Postingan</a>
                            @endif
                        </td>
                        <td class='py-2'>{{ $item->penulis }}</td>
                        <td class='py-2'>
                            <span class="px-2 py-1 text-xs font-semibold rounded-full {{ $item->status == 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700' }}">{{ $item->status }}</span>
                        </td>
                        <td class="py-2">
                            <div class="flex items-center gap-2">
                                <button type="button" @click='editItem(@json($item))' class="text-blue-500 hover:text-blue-700 font-medium p-1 bg-blue-50 rounded"><i data-lucide="edit" class="w-4 h-4"></i></button>
                                <form action="{{ route('admin.artikel.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus postingan ini?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-500 hover:text-red-700 font-medium p-1 bg-red-50 rounded"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
</div>
@endsection
