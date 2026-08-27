import re

with open("src/app/admin/layout.tsx", "r") as f:
    code = f.read()

# Add access rights
access_code = """
  const canAccessAkademik = isSuperAdmin || userRoles.some(r => r.includes('ketua') || r.includes('litbang') || r.includes('metkom'));
  const canAccessDivisi = isSuperAdmin || userRoles.some(r => r.includes('kabid') || r.includes('wakil'));
"""
code = re.sub(r'const canAccessAkademik = .*?\);', access_code.strip(), code, flags=re.DOTALL)

# Add links
links_code = """
                {canAccessAkademik && (
                  <>
                    <Link href="/admin/modul" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm">Bank Modul</Link>
                    <Link href="/admin/karya" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm">Karya</Link>
                    <Link href="/admin/lomba" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm">Info Lomba</Link>
                  </>
                )}
                {canAccessDivisi && (
                  <>
                    <Link href="/admin/survey" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm">Survey</Link>
                    <Link href="/admin/klub" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm">Klub</Link>
                    <Link href="/admin/merchandise" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm">Merchandise</Link>
                  </>
                )}
"""
code = re.sub(r'\{canAccessAkademik.*?</>\s*\}', links_code.strip(), code, flags=re.DOTALL)

with open("src/app/admin/layout.tsx", "w") as f:
    f.write(code)
