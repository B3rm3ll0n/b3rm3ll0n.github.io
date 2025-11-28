#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extrae el frontmatter de un archivo markdown
 * @param {string} mdText - Contenido del archivo markdown
 * @returns {Object} { frontmatter: Object, content: string }
 */
function extractFrontmatter(mdText) {
  const match = mdText.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    return {
      frontmatter: { title: 'Post', date: '', excerpt: '' },
      content: mdText
    };
  }

  const frontmatter = {};
  const lines = match[1].split('\n');
  
  lines.forEach(line => {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  });

  return {
    frontmatter: { 
      title: frontmatter.title || 'Post',
      date: frontmatter.date || '',
      excerpt: frontmatter.excerpt || ''
    },
    content: match[2]
  };
}

/**
 * Carga un componente HTML
 * @param {string} filePath - Ruta del archivo
 * @returns {string} Contenido del archivo o vacío si no existe
 */
function loadComponent(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (err) {
    console.warn(`Advertencia: No se pudo cargar ${filePath}`);
  }
  return '';
}

/**
 * Convierte markdown a HTML
 * @param {string} mdContent - Contenido markdown
 * @returns {string} HTML generado
 */
async function markdownToHtml(mdContent) {
  try {
    return await marked(mdContent, {
      async: true,
      gfm: true,
      breaks: true,
      pedantic: false
    });
  } catch (err) {
    console.error('Error al convertir markdown:', err.message);
    throw err;
  }
}

/**
 * Genera la plantilla HTML final
 * @param {Object} front - Datos del frontmatter
 * @param {string} htmlContent - Contenido HTML
 * @returns {string} HTML completo
 */
function generateHtmlTemplate(front, htmlContent) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${front.title}</title>
    
    <!-- Theme global -->
    <link rel="stylesheet" href="/assets/css/main.css">
    <!-- Cargar componentes -->
<script>
fetch("../../components/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  });

// Cargar footer
fetch("../components/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer").innerHTML = html;
  });
</script>

  </head>
<body>

    <!-- NAVBAR dinámica -->
    <div id="navbar"></div>

    <main>
        <article class="post-container" style="max-width: 900px; margin: 0 auto; padding: 40px 16px;">
            <h1 style="margin-bottom: 10px;">${front.title}</h1>
            <p class="meta" style="opacity: 0.7; margin-bottom: 25px;">${front.date}</p>

            <div class="post-content">
${htmlContent}
            </div>
        </article>
    </main>

    <!-- FOOTER dinámico -->
    <div id="footer"></div>

    
</body>
</html>`;
}


/**
 * Función principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.log('Uso: md2html <input.md> <output.html>');
    console.log('');
    console.log('Ejemplo:');
    console.log('  md2html ./posts/post.md ./output/post.html');
    process.exit(1);
  }

  const [mdPath, htmlPath] = args;

  try {
    // Leer archivo markdown
    if (!fs.existsSync(mdPath)) {
      console.error(`❌ Error: El archivo ${mdPath} no existe`);
      process.exit(1);
    }

    const mdText = fs.readFileSync(mdPath, 'utf-8');
    console.log(`📄 Leyendo: ${mdPath}`);

    // Extraer frontmatter
    const { frontmatter, content } = extractFrontmatter(mdText);
    console.log(`📋 Título: ${frontmatter.title}`);

    // Convertir markdown a HTML
    const htmlContent = await markdownToHtml(content);
    console.log('✅ Markdown convertido a HTML');

    // Generar HTML completo
    const htmlFinal = generateHtmlTemplate(frontmatter, htmlContent);

    // Crear directorio si no existe
    const dirPath = path.dirname(htmlPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Directorio creado: ${dirPath}`);
    }

    // Guardar archivo HTML
    fs.writeFileSync(htmlPath, htmlFinal, 'utf-8');
    console.log(`✅ Generado: ${htmlPath}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
