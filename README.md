# b3rm3ll0n.github.io

Sitio web estatico modular y escalable dedicado a **Hacking Etico y Ciberseguridad**.

## Caracteristicas

- HTML + CSS + JavaScript puro - Sin frameworks, codigo limpio
- Modular y escalable - Componentes reutilizables
- Responsive design - Mobile, tablet y desktop
- Parser Markdown integrado - Carga de posts dinamicos
- Tema oscuro moderno - Minimalista y profesional
- Compatible con GitHub Pages - Deployment sencillo

## Estructura del Proyecto

```
.
├── assets/
│   ├── css/
│   │   ├── main.css          # Variables, reset, base global
│   │   ├── layout.css         # Grid, flexbox, containers
│   │   ├── components.css     # Componentes reutilizables
│   │   └── responsive.css     # Media queries
│   ├── js/
│   │   ├── utils.js           # Funciones auxiliares
│   │   ├── markdown.js        # Parser Markdown a HTML
│   │   └── main.js            # Logica principal
│   ├── images/                # Imagenes estaticas
│   └── posts/                 # Posts en Markdown
│
├── components/
│   ├── header.html            # Navbar/Header
│   ├── footer.html            # Footer
│   └── navbar.html            # Navegacion
│
├── index.html                 # Pagina de inicio
├── blog.html                  # Pagina del blog
├── paths.html                 # Learning paths
└── README.md                  # Documentacion
```

## Inicio Rapido

### 1. Clonar el repositorio

```bash
git clone https://github.com/B3rm3ll0n/b3rm3ll0n.github.io.git
cd b3rm3ll0n.github.io
```

### 2. Ver localmente

Abre index.html directamente en tu navegador (sin servidor requerido).

### 3. Editar contenido

- **Blog**: Agrega archivos `.md` en `assets/posts/`
- **Estilos**: Modifica archivos CSS en `assets/css/`

## Crear Posts

Los posts se escriben en **Markdown** con metadatos YAML:

```markdown
---
title: Titulo del Post
date: 2025-11-26
excerpt: Descripcion breve
tags: tag1, tag2, tag3
---

# Contenido del Post
```

## Desplegar en GitHub Pages

Settings > Pages > main branch

## Autor

**B3RM3LL0N** - Especialista en Hacking Etico y Ciberseguridad

## Licencia

MIT
