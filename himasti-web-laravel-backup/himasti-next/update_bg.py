import re

with open("src/app/login/page.tsx", "r") as f:
    code = f.read()

# Animate the grid
code = code.replace(
    'className="absolute inset-0 bg-grid-pattern animate-fade-in opacity-30"',
    'className="absolute inset-0 bg-grid-pattern animate-fade-in opacity-30 animate-grid-pan"'
)

# Animate the glowing orbs
code = code.replace(
    'className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[120px]"',
    'className="absolute top-[0%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-blob"'
)
code = code.replace(
    'className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"',
    'className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/15 blur-[120px] animate-blob animation-delay-2000"'
)

# Add a third orb for better dynamic lighting
new_orb = '<div className="absolute -bottom-[20%] left-[30%] w-[50%] h-[50%] rounded-full bg-cyan-600/15 blur-[120px] animate-blob animation-delay-4000"></div>'
code = code.replace(
    '<div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/15 blur-[120px] animate-blob animation-delay-2000"></div>',
    f'<div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/15 blur-[120px] animate-blob animation-delay-2000"></div>\n        {new_orb}'
)

with open("src/app/login/page.tsx", "w") as f:
    f.write(code)

