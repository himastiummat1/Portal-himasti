import re

with open("src/app/login/page.tsx", "r") as f:
    code = f.read()

# Add import
if 'ParticleBackground' not in code:
    code = code.replace(
        'import Image from "next/image";',
        'import Image from "next/image";\nimport ParticleBackground from "@/components/ui/ParticleBackground";'
    )

# Replace the grid pattern and blobs with the ParticleBackground
pattern_to_replace = r'''{/\* Grid Pattern \(Jaring ChatGPT\) \*/}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-fade-in opacity-30 animate-grid-pan"></div>
      </div>

      {/\* Vercel-like background glow with HIMASTI Base Blue Color \*/}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none animate-fade-in">
        <div className="absolute top-\[0%\] left-\[10%\] w-\[40%\] h-\[40%\] rounded-full bg-blue-600/20 blur-\[120px\] animate-blob"></div>
        <div className="absolute top-\[20%\] right-\[10%\] w-\[40%\] h-\[40%\] rounded-full bg-indigo-600/15 blur-\[120px\] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-\[20%\] left-\[30%\] w-\[50%\] h-\[50%\] rounded-full bg-cyan-600/15 blur-\[120px\] animate-blob animation-delay-4000"></div>
      </div>'''

new_bg = '''{/* Pythagoras / Constellation Particle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-fade-in">
        <ParticleBackground />
      </div>'''

code = re.sub(pattern_to_replace, new_bg, code, flags=re.DOTALL)

with open("src/app/login/page.tsx", "w") as f:
    f.write(code)

