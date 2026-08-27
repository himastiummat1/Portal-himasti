const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/actions.ts', 'utf8');

const search = 'const no_hp = formData.get("no_hp") as string;';
const replace = 'const no_hp = formData.get("no_hp") as string;\n  const jenis_kelamin = formData.get("jenis_kelamin") as string;';
content = content.replace(search, replace);

const dbSearch = 'if (kader) {\n        await prisma.dataKader.update({ where: { id: kader.id }, data: { no_hp } });\n      }';
const dbReplace = 'if (kader) {\n        await prisma.dataKader.update({ where: { id: kader.id }, data: { no_hp, ...(jenis_kelamin && { jenis_kelamin }) } });\n      }';
content = content.replace(dbSearch, dbReplace);

fs.writeFileSync('src/app/admin/kader/actions.ts', content);
