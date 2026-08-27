import re

with open("src/components/layout/TopNav.tsx", "r") as f:
    code = f.read()

# Add import
if 'import { signOut } from "next-auth/react";' not in code:
    code = code.replace('import { useState, useRef, useEffect } from "react";', 'import { useState, useRef, useEffect } from "react";\nimport { signOut } from "next-auth/react";')

# Replace form action with onClick
form_pattern = r'<form action="/api/auth/signout" method="POST">.*?</form>'
button_code = """<button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100">
                Keluar
              </button>"""

code = re.sub(form_pattern, button_code, code, flags=re.DOTALL)

# Do it for mobile menu too
mobile_form_pattern = r'<form action="/api/auth/signout" method="POST">.*?</form>'
mobile_button_code = """<button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-md">
                Keluar
              </button>"""
              
# Need to substitute the second one carefully if re.sub replaces all, but button_code and mobile_button_code are different.
# Actually, I'll just manually replace both based on context.

