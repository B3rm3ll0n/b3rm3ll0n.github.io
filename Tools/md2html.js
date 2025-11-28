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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background: #f9f9f9; }
        main { max-width: 1200px; margin: 0 auto; padding: 60px 16px; }
        article { background: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { font-size: 2.5em; margin-bottom: 16px; color: #1a1a1a; }
        h2 { font-size: 1.8em; margin: 24px 0 16px 0; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 8px; }
        h3 { font-size: 1.4em; margin: 20px 0 12px 0; color: #34495e; }
        p { margin-bottom: 16px; text-align: justify; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', Courier, monospace; color: #d73a49; }
        pre { background: #282c34; color: #abb2bf; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 16px 0; }
        pre code { background: none; padding: 0; color: inherit; }
        blockquote { border-left: 4px solid #3498db; padding-left: 16px; margin: 16px 0; color: #666; font-style: italic; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        table th { background: #3498db; color: white; padding: 12px; text-align: left; }
        table td { border: 1px solid #ddd; padding: 12px; }
        table tr:nth-child(even) { background: #f9f9f9; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        ul, ol { margin-left: 24px; margin-bottom: 16px; }
        li { margin-bottom: 8px; }
        img { max-width: 100%; height: auto; margin: 16px 0; border-radius: 6px; }
        .meta { color: #aaa; font-size: 14px; margin-bottom: 24px; }
    </style>
</head>
<body>
    <main>
        <article>
            <h1>${front.title}</h1>
            <p class="meta">${front.date}</p>
            <div>
${htmlContent}
            </div>
        </article>
    </main>
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
