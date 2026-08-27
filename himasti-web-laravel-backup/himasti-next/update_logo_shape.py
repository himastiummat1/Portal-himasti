import re

with open("src/app/login/page.tsx", "r") as f:
    code = f.read()

# Replace the circular logo container with a transparent/square one
old_logo_html = """<div 
            className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.3)] p-2 border-2 border-blue-100 transition-all duration-300 hover:scale-105 active:scale-95 active:animate-heartbeat cursor-pointer"
            title="Klik dan tahan untuk Easter Egg!"
          >
            {/* Logo HIMASTI asli */}
            <img 
              src="/images/logo_himasti.jpg" 
              alt="Logo HIMASTI" 
              className="h-full w-full object-contain rounded-full"
            />
          </div>"""

new_logo_html = """<div 
            className="h-24 w-auto flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 active:animate-heartbeat cursor-pointer drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            title="Klik dan tahan untuk Easter Egg!"
          >
            {/* Logo HIMASTI asli tanpa kotak bulat putih */}
            <img 
              src="/images/logo-himasti.png" 
              onError={(e) => { e.currentTarget.src = "/images/logo_himasti.jpg" }}
              alt="Logo HIMASTI" 
              className="h-full w-auto object-contain rounded-lg"
            />
          </div>"""

code = code.replace(old_logo_html, new_logo_html)

with open("src/app/login/page.tsx", "w") as f:
    f.write(code)

