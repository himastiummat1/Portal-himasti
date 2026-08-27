import re

with open("src/app/login/page.tsx", "r") as f:
    code = f.read()

# Remove the ParticleBackground import
code = re.sub(r'import ParticleBackground.*?\n', '', code)

# Replace the Canvas with a super minimal static CSS grid (ChatGPT style)
new_bg = '''{/* Minimalist ChatGPT-style Background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-pattern opacity-20"></div>'''

code = re.sub(r'\{/\* Pythagoras / Constellation Particle Background \*/\}.*?</ParticleBackground>\n      </div>', new_bg, code, flags=re.DOTALL)

with open("src/app/login/page.tsx", "w") as f:
    f.write(code)

