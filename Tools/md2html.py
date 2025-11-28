"""
md2html.py

Convierte archivos Markdown a HTML usando la plantilla y estilos del proyecto Lado B.
- Lee un archivo .md (con frontmatter opcional)
- Inserta el contenido convertido en una plantilla HTML con navbar/footer y CSS
- Guarda el resultado en /posts/{slug}.html

Uso:
    python3 md2html.py input.md output.html
"""
import sys
import os
import re
from pathlib import Path

try:
    import markdown
except ImportError:
    print("Falta el paquete 'markdown'. Instala con: pip install markdown")
    sys.exit(1)

def extract_frontmatter(md_text):
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", md_text, re.DOTALL)
    if match:
        frontmatter = {}
        for line in match.group(1).splitlines():
            if ':' in line:
                k, v = line.split(':', 1)
                frontmatter[k.strip()] = v.strip()
        content = match.group(2)
        return frontmatter, content
    return {"title": "Post", "date": "", "excerpt": ""}, md_text

def load_component(path):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return f.read()
    return ""

def main():
    if len(sys.argv) != 3:
        print("Uso: python3 md2html.py input.md output.html")
        sys.exit(1)
    md_path, html_path = sys.argv[1], sys.argv[2]
    with open(md_path, encoding="utf-8") as f:
        md_text = f.read()
    front, content_md = extract_frontmatter(md_text)
    html_content = markdown.markdown(content_md, extensions=['fenced_code', 'codehilite', 'tables'])

    # Cargar componentes y estilos
    base_dir = Path(__file__).parent.parent
    css = load_component(str(base_dir / "assets/css/main.css"))
    navbar = load_component(str(base_dir / "components/navbar.html"))
    footer = load_component(str(base_dir / "components/footer.html"))

    # Plantilla HTML
    html = f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{front.get('title', 'Post')}</title>
    <style>{css}</style>
</head>
<body>
    <div id="navbar">{navbar}</div>
    <main style="max-width:1200px;margin:0 auto;padding:60px 16px;">
        <article>
            <h1>{front.get('title', '')}</h1>
            <p style="color:#aaa;font-size:14px;">{front.get('date', '')}</p>
            <div>{html_content}</div>
        </article>
    </main>
    <div id="footer">{footer}</div>
</body>
</html>'''
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generado: {html_path}")

if __name__ == "__main__":
    main()
