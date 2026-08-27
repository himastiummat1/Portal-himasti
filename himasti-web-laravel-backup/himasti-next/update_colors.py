import re

# Update LoginContainer.tsx (Blue -> Purple/Black/Yellow theme)
with open("src/app/login/LoginContainer.tsx", "r") as f:
    container = f.read()

container = container.replace('bg-blue-900', 'bg-purple-950')
container = container.replace('from-blue-900 via-blue-800 to-indigo-900', 'from-[#0f0019] via-purple-950 to-purple-900')
container = container.replace('text-blue-900 bg-white', 'text-purple-950 bg-yellow-400') # Yellow button with purple text
container = container.replace('text-blue-100', 'text-purple-100')
container = container.replace('text-blue-300/80', 'text-purple-300/80')
container = container.replace('rgba(59,130,246,0.3)', 'rgba(168,85,247,0.2)') # Purple glow instead of blue

with open("src/app/login/LoginContainer.tsx", "w") as f:
    f.write(container)

# Update LoginForm.tsx (Blue -> Purple)
with open("src/app/login/LoginForm.tsx", "r") as f:
    form = f.read()

form = form.replace('blue-500', 'purple-600')
form = form.replace('blue-600', 'purple-600')
form = form.replace('blue-700', 'purple-700')
# Since it was already using gray-900 for the submit button, let's keep the submit button black or make it purple.
# Currently: bg-gray-900 hover:bg-gray-800. Let's make it bg-purple-600 hover:bg-purple-700.
form = form.replace('bg-gray-900', 'bg-purple-700')
form = form.replace('hover:bg-gray-800', 'hover:bg-purple-800')
form = form.replace('focus-visible:outline-gray-900', 'focus-visible:outline-purple-700')

with open("src/app/login/LoginForm.tsx", "w") as f:
    f.write(form)
