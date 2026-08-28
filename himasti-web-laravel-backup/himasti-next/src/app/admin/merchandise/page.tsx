import { getMerchandises, addMerchandise, deleteMerchandise, updateMerchandise } from "./actions";

export default async function MerchandisePage() {
  const merchandises = await getMerchandises();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Merchandise HIMASTI</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola katalog produk, baju korsa, dan atribut mahasiswa.</p>
        </div>
      </div>

      {/* Basic Brutalist Form Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Tambah Produk Baru</h2>
        <form action={addMerchandise} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
              <input type="text" name="title" required className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm" placeholder="Korsa HIMASTI 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="category" className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm">
                <option value="Pakaian">Pakaian</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Buku/Modul">Buku/Modul</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input type="number" name="price" required min="0" className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm font-mono" placeholder="150000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
              <input type="number" name="stock" required min="0" className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm font-mono" placeholder="50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (Opsional)</label>
              <input type="url" name="gambar" className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm" placeholder="https://example.com/image.png" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
              <textarea name="description" rows={2} className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm" placeholder="Bahan drill, bordir komputer..." />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-black text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Simpan Produk
            </button>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {merchandises.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    Belum ada produk di etalase.
                  </td>
                </tr>
              ) : (
                merchandises.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                          {item.gambar ? (
                            <img src={item.gambar} alt={item.title} className="h-10 w-10 object-cover" />
                          ) : (
                            <span className="text-xs text-gray-400">No Img</span>
                          )}
                        </div>
                        <div className="ml-4 max-w-[200px]">
                          <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                          <div className="text-sm text-gray-500 truncate">{item.status}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      Rp {item.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono">
                      <span className={item.stock === 0 ? "text-red-600 font-bold" : "text-gray-900"}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <form action={async () => {
                        "use server";
                        await deleteMerchandise(item.id);
                      }}>
                        <button type="submit" className="text-red-600 hover:text-red-900 transition-colors">
                          Hapus
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
