# MD2HTML Converter

Herramienta para convertir archivos Markdown a HTML completamente funcionales para tu blog.

## Características

✨ **Características principales:**
- ✅ Convierte Markdown a HTML con soporte para Markdown extendido (GFM)
- ✅ Extrae frontmatter YAML automáticamente
- ✅ Genera HTML con estilos profesionales
- ✅ Crea directorios automáticamente si no existen
- ✅ Interfaz de línea de comandos simple
- ✅ No requiere Python (Node.js puro)

## Instalación

```bash
npm install
```

## Uso

### Opción 1: Comando directo

```bash
node md2html.js <input.md> <output.html>
```

**Ejemplo:**
```bash
node md2html.js ../b3rm3ll0n.github.io/assets/posts/introduccion-hacking-etico.md ./output/post.html
```

### Opción 2: Como comando global (después de npm install -g)

```bash
md2html input.md output.html
```

### Opción 3: Script de lotes (batch)

Usa `batch-convert.js` para convertir múltiples archivos:

```bash
node batch-convert.js
```

## Estructura del Frontmatter

Tu archivo Markdown debe tener la siguiente estructura:

```markdown
---
title: Mi Título del Post
date: 28 de noviembre de 2025
excerpt: Una breve descripción del post
---

# Contenido aquí

Tu contenido markdown aquí...
```

## Ejemplo Completo

**Archivo de entrada:** `post.md`
```markdown
---
title: Introducción al Hacking Ético
date: 28 de noviembre de 2025
excerpt: Aprende los fundamentos del hacking ético
---

# Introducción al Hacking Ético

El hacking ético es la práctica de...

## Conceptos Clave

- Seguridad ofensiva
- Pruebas de penetración
- Búsqueda de vulnerabilidades

Aquí viene el contenido...
```

**Comando:**
```bash
node md2html.js post.md post.html
```

**Resultado:** Se genera `post.html` con:
- HTML5 válido
- Estilos CSS profesionales
- Título, fecha y contenido bien formateados
- Soporte para código, tablas, listas, citas, etc.

## Estilos Soportados

- **Títulos:** H1, H2, H3
- **Párrafos:** Texto justificado
- **Código:** Inline (`code`) y bloques (con fondo oscuro)
- **Listas:** Ordenadas y desordenadas
- **Tablas:** Con estilos alternados
- **Citas:** Con barra lateral azul
- **Enlaces:** Interactivos
- **Imágenes:** Responsive

## Características Avanzadas

### Markdown soportado:
- **Bold:** `**texto**`
- **Italic:** `*texto*`
- **Strikethrough:** `~~texto~~`
- **Links:** `[texto](url)`
- **Imágenes:** `![alt](url)`
- **Código bloques:**
  ```
  \`\`\`javascript
  console.log('Hola');
  \`\`\`
  ```
- **Tablas:**
  ```
  | Col1 | Col2 |
  |------|------|
  | Data | Data |
  ```

## Troubleshooting

### Error: "El archivo X no existe"
- Verifica la ruta del archivo de entrada
- Usa rutas absolutas o relativas correctas

### Error: "Cannot find module 'marked'"
- Ejecuta: `npm install`

### El HTML se ve mal
- Abre el archivo HTML en el navegador
- Verifica que el CSS esté correctamente cargado

## Próximas Mejoras

- [ ] Soporte para temas personalizados
- [ ] Generación automática de índice de contenidos
- [ ] Integración con sistema de navegación
- [ ] Generación de sitemap

## Licencia

MIT

---

**Creado para:** b3rm3ll0n.github.io
