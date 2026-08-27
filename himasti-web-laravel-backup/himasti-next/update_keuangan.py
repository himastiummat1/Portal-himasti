import re

with open("src/app/admin/keuangan/KeuanganClient.tsx", "r") as f:
    code = f.read()

# Add imports
import_recharts = "import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';\n"
code = code.replace('import { useState } from "react";', 'import { useState, useMemo } from "react";\n' + import_recharts)

# Prepare Chart Data inside the component
chart_data_code = """
  // Siapkan data grafik per bulan
  const chartData = useMemo(() => {
    const dataMap: Record<string, { name: string; Pemasukan: number; Pengeluaran: number }> = {};
    records.forEach(r => {
      const date = new Date(r.tanggal);
      const monthYear = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      if (!dataMap[monthYear]) {
        dataMap[monthYear] = { name: monthYear, Pemasukan: 0, Pengeluaran: 0 };
      }
      if (r.tipe === 'pemasukan') dataMap[monthYear].Pemasukan += r.jumlah;
      else dataMap[monthYear].Pengeluaran += r.jumlah;
    });
    return Object.values(dataMap);
  }, [records]);
"""
code = code.replace('const formatDate = (isoString: string) => {', chart_data_code + '\n  const formatDate = (isoString: string) => {')

# Add Chart UI after SUMMARY CARDS
chart_ui = """
      {/* DIAGRAM KEUANGAN */}
      {records.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Grafik Arus Kas (Per Bulan)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(val) => `Rp${(val/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => formatRupiah(value)}
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Pemasukan" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
"""
code = code.replace('      {/* MAIN TABLE */}', chart_ui + '\n      {/* MAIN TABLE */}')

with open("src/app/admin/keuangan/KeuanganClient.tsx", "w") as f:
    f.write(code)
