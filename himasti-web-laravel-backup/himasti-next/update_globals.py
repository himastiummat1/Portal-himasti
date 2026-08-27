import re

with open("src/app/globals.css", "r") as f:
    css = f.read()

# Replace the square grid with a subtle dot pattern
new_css = re.sub(
    r'\.bg-grid-pattern \{.*?\}',
    '''.bg-grid-pattern {
  background-size: 20px 20px;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  mask-image: radial-gradient(circle at center, black 50%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 50%, transparent 100%);
}''',
    css,
    flags=re.DOTALL
)

with open("src/app/globals.css", "w") as f:
    f.write(new_css)

