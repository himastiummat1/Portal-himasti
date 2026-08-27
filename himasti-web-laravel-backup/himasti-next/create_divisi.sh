mkdir -p src/app/admin/survey
mkdir -p src/app/admin/klub
mkdir -p src/app/admin/merchandise

# SURVEY
cat << 'INNER' > src/app/admin/survey/page.tsx
export default function Page() { return <div className="p-8"><h1>Survey Kuesioner Mahasiswa</h1><p>Module migrated to database. UI coming soon.</p></div>; }
INNER

# KLUB
cat << 'INNER' > src/app/admin/klub/page.tsx
export default function Page() { return <div className="p-8"><h1>Klub IT & Minat Bakat</h1><p>Module migrated to database. UI coming soon.</p></div>; }
INNER

# MERCHANDISE
cat << 'INNER' > src/app/admin/merchandise/page.tsx
export default function Page() { return <div className="p-8"><h1>Merchandise & Danus</h1><p>Module migrated to database. UI coming soon.</p></div>; }
INNER
