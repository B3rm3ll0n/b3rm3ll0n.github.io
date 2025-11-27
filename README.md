# b3rm3ll0n.github.io

Sitio web estático modular y escalable dedicado a **Hacking Ético y Ciberseguridad**.

## 🎯 Características

- ✅ **HTML + CSS + JavaScript puro** - Sin frameworks, código limpio
- ✅ **Modular y escalable** - Componentes reutilizables
- ✅ **Responsive design** - Mobile, tablet y desktop
- ✅ **Parser Markdown integrado** - Carga de posts dinámicos
- ✅ **Componentes dinámicos** - Sistema de carga de componentes
- ✅ **Tema oscuro moderno** - Minimalista y profesional
- ✅ **Compatible con GitHub Pages** - Deployment sencillo

## 📁 Estructura del Proyecto

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
│   │   ├── markdown.js        # Parser Markdown → HTML
│   │   ├── components.js      # Sistema de componentes
│   │   └── main.js            # Lógica principal
│   ├── images/                # Imágenes estáticas
│   └── posts/                 # Posts en Markdown
│
├── components/
│   ├── header.html            # Navbar/Header
│   ├── footer.html            # Footer
│   ├── navbar.html            # Navegación (alternativa)
│   └── post-card.html         # Card de post
│
├── index.html                 # Página de inicio
├── blog.html                  # Página del blog
├── paths.html                 # Learning paths
└── README.md                  # Documentación
```

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/B3rm3ll0n/b3rm3ll0n.github.io.git
cd b3rm3ll0n.github.io
```

### 2. Servir localmente

```bash
python -m http.server 8000
```

### 3. Editar contenido

- **Blog**: Agrega archivos `.md` en `assets/posts/`
- **Componentes**: Edita archivos en `components/`
- **Estilos**: Modifica archivos CSS en `assets/css/`

## 📝 Crear Posts

Los posts se escriben en **Markdown** con metadatos YAML:

```markdown
---
title: Título del Post
date: 2025-11-26
excerpt: Descripción breve
tags: tag1, tag2, tag3
---

# Contenido del Post
```

## 🧩 Sistema de Componentes

Componentes modulares cargados dinámicamente:

```javascript
await ComponentManager.load('header', './components/header.html');
```

## 🚀 Desplegar en GitHub Pages

Settings → Pages → main branch

## 👨‍💻 Autor

**B3RM3LL0N** - Especialista en Hacking Ético y Ciberseguridad

## 📄 Licencia

MIT
