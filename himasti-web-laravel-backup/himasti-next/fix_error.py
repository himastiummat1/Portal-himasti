with open("src/app/login/page.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'onError={(e) => { e.currentTarget.src = "/images/logo_himasti.jpg" }}',
    ''
)

with open("src/app/login/page.tsx", "w") as f:
    f.write(code)

