import re

with open("src/app/globals.css", "r") as f:
    css = f.read()

# Replace animations with much more elegant ones
new_anim_css = """
/* Ultra-smooth Vercel-like Animations */
.animate-fade-up {
  opacity: 0;
  animation: smoothFadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: smoothFadeIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }

@keyframes smoothFadeUp {
  0% { 
    opacity: 0; 
    transform: translateY(12px) scale(0.98); 
    filter: blur(4px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
    filter: blur(0);
  }
}

@keyframes smoothFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.animate-heartbeat {
  animation: heartbeat 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
"""

css = re.sub(r'/\* Custom UI Animations \*/.*?@keyframes fadeIn \{.*?\}', new_anim_css.strip(), css, flags=re.DOTALL)

with open("src/app/globals.css", "w") as f:
    f.write(css)

