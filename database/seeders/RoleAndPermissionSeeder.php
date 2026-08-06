<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $adminSekretariat = Role::firstOrCreate(['name' => 'admin_sekretariat']);
        $adminKaderisasi = Role::firstOrCreate(['name' => 'admin_kaderisasi']);
        $adminHumas = Role::firstOrCreate(['name' => 'admin_humas']);
        
        // New Roles
        $ketuaHimpunan = Role::firstOrCreate(['name' => 'ketua_himpunan']);
        $bendahara = Role::firstOrCreate(['name' => 'bendahara']);
        $kabidKemuhammadiyahan = Role::firstOrCreate(['name' => 'kabid_kemuhammadiyahan']);
        $kabidKeorganisasian = Role::firstOrCreate(['name' => 'kabid_keorganisasian']);
        $kabidMetkom = Role::firstOrCreate(['name' => 'kabid_metkom']);
        $kabidLitbang = Role::firstOrCreate(['name' => 'kabid_litbang']);
        $kabidKewirausahaan = Role::firstOrCreate(['name' => 'kabid_kewirausahaan']);
        $kabidMikat = Role::firstOrCreate(['name' => 'kabid_mikat']);
        
        $kader = Role::firstOrCreate(['name' => 'kader']);

        // Create default Super Admin (Kabid Teknologi)
        $user = User::firstOrCreate(
            ['email' => 'kabid.teknologi@himasti.org'],
            [
                'name' => 'Kabid Teknologi',
                'password' => Hash::make('password'),
            ]
        );

        $user->assignRole($superAdmin);
    }
}
