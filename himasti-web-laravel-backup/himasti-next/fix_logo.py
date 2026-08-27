with open("src/app/login/page.tsx", "r") as f:
    code = f.read()

# Replace the logo with the JPG and style it like an app icon
code = code.replace(
    'src="/images/logo-himasti.png"',
    'src="/images/logo_himasti.jpg"'
)

# Fix the container to have a subtle white background so the JPG blends perfectly like an iOS app icon
code = code.replace(
    'className="h-24 w-auto flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 active:animate-heartbeat cursor-pointer drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"',
    'className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] p-1.5 border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 active:animate-heartbeat cursor-pointer overflow-hidden"'
)

with open("src/app/login/page.tsx", "w") as f:
    f.write(code)

