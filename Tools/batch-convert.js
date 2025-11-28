#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para convertir múltiples archivos markdown a HTML en lote
 */

const postsDir = '../b3rm3ll0n.github.io/assets/posts';
const outputDir = './output';

console.log('🔄 Convertidor de Markdown a HTML en Lote\n');

try {
  // Crear directorio de salida si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Directorio creado: ${outputDir}\n`);
  }

  // Buscar todos los archivos .md
  const mdFiles = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'));

  if (mdFiles.length === 0) {
    console.log('⚠️  No se encontraron archivos .md');
    process.exit(0);
  }

  console.log(`📚 Se encontraron ${mdFiles.length} archivo(s)\n`);

  let successCount = 0;
  let errorCount = 0;

  // Procesar cada archivo
  mdFiles.forEach((mdFile, index) => {
    const inputPath = path.join(postsDir, mdFile);
    const outputName = mdFile.replace('.md', '.html');
    const outputPath = path.join(outputDir, outputName);

    try {
      console.log(`[${index + 1}/${mdFiles.length}] Procesando: ${mdFile}`);
      execSync(`node md2html.js "${inputPath}" "${outputPath}"`, { 
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      console.log(`           ✅ Generado: ${outputName}\n`);
      successCount++;
    } catch (err) {
      console.log(`           ❌ Error: ${err.message}\n`);
      errorCount++;
    }
  });

  // Resumen
  console.log('━'.repeat(50));
  console.log(`✅ Completado: ${successCount} archivo(s) convertido(s)`);
  if (errorCount > 0) {
    console.log(`❌ Errores: ${errorCount} archivo(s) fallido(s)`);
  }
  console.log(`📁 Salida: ${path.resolve(outputDir)}`);

} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
