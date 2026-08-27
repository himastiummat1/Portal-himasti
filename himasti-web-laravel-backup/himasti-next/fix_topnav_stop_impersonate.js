const fs = require('fs');
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

// Add import
const searchImport = 'import { useState, useRef, useEffect } from "react";';
const replaceImport = 'import { useState, useRef, useEffect } from "react";\nimport { stopImpersonating } from "@/app/admin/kader/actions";';
content = content.replace(searchImport, replaceImport);

// Update button onClick
const searchOnClick = `onClick={() => {
                document.cookie = "impersonated_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/admin";
              }}`;
const replaceOnClick = `onClick={async () => {
                await stopImpersonating();
                window.location.href = "/admin";
              }}`;
content = content.replace(searchOnClick, replaceOnClick);

fs.writeFileSync('src/components/layout/TopNav.tsx', content);
