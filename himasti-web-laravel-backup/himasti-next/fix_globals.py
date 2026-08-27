import re

with open("src/app/globals.css", "r") as f:
    css = f.read()

# Remove everything after body block
css = re.split(r'body \{.*?\}', css, flags=re.DOTALL)[0] + """body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

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
  0% { opacity: 0; transform: translateY(12px) scale(0.98); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes smoothFadeIn {
  0% { opacity: 0; filter: blur(2px); }
  100% { opacity: 1; filter: blur(0); }
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  15% { transform: scale(1.05); }
  30% { transform: scale(1); }
  45% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.animate-heartbeat {
  animation: heartbeat 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* Vercel-like Inputs */
.vercel-input {
  background-color: #000;
  border: 1px solid #333;
  color: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.vercel-input:focus {
  outline: none;
  border-color: #888;
}
.vercel-button {
  background-color: #fff;
  color: #000;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.vercel-button:hover {
  background-color: #e5e5e5;
}
.vercel-button:active {
  transform: scale(0.98);
}

/* Premium Dot Pattern */
.bg-grid-pattern {
  background-size: 20px 20px;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
  mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
}
"""

with open("src/app/globals.css", "w") as f:
    f.write(css)

