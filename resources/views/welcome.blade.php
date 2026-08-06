<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HIMASTI - Himpunan Mahasiswa Sistem & Teknologi Informasi</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <x-dark-mode-init />
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 antialiased min-h-screen flex flex-col justify-center items-center relative">
    
    <div class="absolute top-4 right-4">
        <x-dark-mode-toggle />
    </div>

    <div class="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg max-w-xl text-center border border-gray-200 dark:border-gray-700">
        <div class="flex justify-center mb-6">
            <img src="{{ asset('images/logo_himasti.jpg') }}" alt="Logo HIMASTI" class="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-600">
        </div>
        <h1 class="text-3xl font-bold text-slate-800 dark:text-white mb-4">Selamat Datang di Portal Internal HIMASTI</h1>
        <p class="text-gray-600 dark:text-gray-300 font-medium mb-2">Himpunan Mahasiswa Sistem & Teknologi Informasi</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
            Sistem ini dirancang untuk mengelola data kaderisasi dan persuratan internal organisasi dengan sistem role-based access.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="{{ route('login') }}" class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Login
            </a>
            <a href="{{ route('register') }}" class="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
                Daftar Akun
            </a>
        </div>
    </div>
</body>
</html>
