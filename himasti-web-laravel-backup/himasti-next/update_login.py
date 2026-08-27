import re

with open("src/app/login/page.tsx", "r") as f:
    code = f.read()

# Make the card simpler and cleaner, remove the cheap backdrop blur
code = code.replace(
    'vercel-card py-8 px-4 sm:rounded-2xl sm:px-10 transition-colors duration-500 hover:border-blue-900/50 relative overflow-hidden backdrop-blur-sm bg-black/60',
    'bg-[#0a0a0a] border border-[#222] py-8 px-4 sm:rounded-2xl sm:px-10 shadow-2xl transition-all duration-300'
)

# Decrease grid opacity so it's barely visible
code = code.replace(
    'opacity-70',
    'opacity-30'
)

with open("src/app/login/page.tsx", "w") as f:
    f.write(code)

