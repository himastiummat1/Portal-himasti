import re

with open("src/app/admin/kader/KaderTableClient.tsx", "r") as f:
    code = f.read()

# Make the search bar and filter dropdown look cooler
code = code.replace(
    'className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"',
    'className="w-full sm:w-72 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"'
)
code = code.replace(
    'className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"',
    'className="w-full sm:w-56 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"'
)
code = code.replace(
    'className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm"',
    'className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:shadow transition-all"'
)

# Table styling enhancements
code = code.replace(
    'className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"',
    'className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden"'
)

code = code.replace(
    'className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"',
    'className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50"'
)

# Modal enhancements
code = code.replace(
    'className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-6"',
    'className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-all"'
)

with open("src/app/admin/kader/KaderTableClient.tsx", "w") as f:
    f.write(code)
