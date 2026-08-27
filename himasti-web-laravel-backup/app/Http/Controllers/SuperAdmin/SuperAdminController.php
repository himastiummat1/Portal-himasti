<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\DataKader;
use App\Models\Surat;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class SuperAdminController extends Controller
{
    /**
     * Statistik overview sistem
     */
    public function index()
    {
        $totalUsers = User::count();
        $totalKader = DataKader::count();
        $totalSurat = Surat::count();
        
        return view('superadmin.dashboard', compact('totalUsers', 'totalKader', 'totalSurat'));
    }

    /**
     * Manajemen akun pengurus & role
     */
    public function users(Request $request)
    {
        $query = User::with(['roles', 'dataKader']);
        
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }
        
        $users = $query->paginate(30)->withQueryString();
        $roles = Role::all();
        
        return view('superadmin.users.index', compact('users', 'roles'));
    }

    /**
     * Assign Role dan Status Kaderisasi
     */
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name',
            'status_kaderisasi' => 'nullable|string'
        ]);

        // Proteksi: Pastikan hanya ada maksimal 1 Super Admin di sistem
        if ($request->role === 'super_admin' && !$user->hasRole('super_admin')) {
            $existingSuperAdminCount = User::role('super_admin')->count();
            if ($existingSuperAdminCount >= 1) {
                $existing = User::role('super_admin')->first();
                return redirect()->back()->with('error', "Gagal! Role Super Admin hanya boleh dimiliki oleh maksimal 1 akun. Saat ini sudah dimiliki oleh {$existing->name}. Anda harus mencabut role-nya terlebih dahulu sebelum memindahkannya ke orang lain.");
            }
        }

        $user->syncRoles([$request->role]);

        if ($request->has('status_kaderisasi')) {
            $user->dataKader()->updateOrCreate(
                ['user_id' => $user->id],
                ['status_kaderisasi' => $request->status_kaderisasi]
            );
        }

        return redirect()->back()->with('success', 'Role & Status berhasil diupdate');
    }

    /**
     * Fitur Super Admin login sebagai user lain tanpa password untuk debugging
     */
    public function impersonate($userId)
    {
        $userToImpersonate = User::findOrFail($userId);
        
        session()->put('impersonate_by', Auth::id());
        
        Auth::login($userToImpersonate);

        return redirect('/')->with('success', 'You are now impersonating ' . $userToImpersonate->name);
    }

    /**
     * Kembali ke akun Super Admin setelah impersonate
     */
    public function leaveImpersonate()
    {
        if (session()->has('impersonate_by')) {
            $superAdminId = session()->get('impersonate_by');
            session()->forget('impersonate_by');
            
            Auth::loginUsingId($superAdminId);
            
            return redirect()->route('superadmin.users')->with('success', 'Successfully returned to original account.');
        }

        return redirect('/');
    }

    /**
     * Menampilkan daftar data kader & surat yang terhapus (Soft Delete)
     */
    public function trash()
    {
        $trashedKaders = DataKader::onlyTrashed()->with('user')->get();
        $trashedSurats = Surat::onlyTrashed()->with('user')->get();
        
        return view('superadmin.trash.index', compact('trashedKaders', 'trashedSurats'));
    }

    /**
     * Mengembalikan data dari Trash
     */
    public function restore($id, $type)
    {
        if ($type === 'kader') {
            $data = DataKader::onlyTrashed()->findOrFail($id);
            $data->restore();
        } elseif ($type === 'surat') {
            $data = Surat::onlyTrashed()->findOrFail($id);
            $data->restore();
        } else {
            abort(404);
        }

        return redirect()->back()->with('success', 'Data berhasil direstore.');
    }

    /**
     * Menghapus data secara permanen dari DB
     */
    public function forceDelete($id, $type)
    {
        if ($type === 'kader') {
            $data = DataKader::onlyTrashed()->findOrFail($id);
            $data->forceDelete();
        } elseif ($type === 'surat') {
            $data = Surat::onlyTrashed()->findOrFail($id);
            if ($data->file_pdf && \Storage::exists('public/' . $data->file_pdf)) {
                \Storage::delete('public/' . $data->file_pdf);
            }
            $data->forceDelete();
        } else {
            abort(404);
        }

        return redirect()->back()->with('success', 'Data berhasil dihapus permanen.');
    }
}
