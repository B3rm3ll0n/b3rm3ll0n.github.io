<!-- DOCUMENTACIÓN DE ARQUITECTURA Y BUENAS PRÁCTICAS -->

# Arquitectura del Proyecto

## Principios de Diseño

### 1. Modularidad
- Cada componente es independiente
- Reutilizable en múltiples lugares
- Bajo acoplamiento

### 2. Escalabilidad
- Fácil agregar nuevas páginas
- Agregar componentes sin duplicación
- Sistema de carga dinámmica

### 3. Mantenibilidad
- Código legible y documentado
- Separación de responsabilidades
- Convenciones de naming consistentes

### 4. Performance
- CSS modular (carga solo lo necesario)
- Caching de componentes
- Lazy loading de contenido

## Estructura de Capas

### Capa de Presentación (HTML)
- Estructura semántica
- Componentes reutilizables
- Accesibilidad

### Capa de Estilos (CSS)
- Variables para personalización
- BEM naming convention
- Responsive design

### Capa de Lógica (JavaScript)
- Vanilla JS (sin dependencias)
- Gestión de estado
- Manejo de eventos

## Convenciones de Código

### HTML
```html
<!-- Usar IDs para targets únicos, classes para estilos -->
<div id="main-content" class="container p-lg">
  <h1 class="section-title">Título</h1>
</div>
```

### CSS
```css
/* BEM Naming Convention */
.card {}              /* Block */
.card__header {}      /* Element */
.card--featured {}    /* Modifier */

/* Variables en `:root` */
--color-primary: #00d4ff;
```

### JavaScript
```javascript
// camelCase para variables y funciones
const myVariable = 42;
function myFunction() {}

// PascalCase para objetos/namespaces
const ComponentManager = {}
const Utils = {}

// UPPER_CASE para constantes
const MAX_ITEMS = 100;
```

## Patrón de Componente

Cada componente HTML debe tener:

1. **Estructura clara**
```html
<div class="my-component">
  <!-- Contenido -->
</div>
```

2. **Clases semánticas**
```html
<div class="card">
  <div class="card__header">Header</div>
  <div class="card__body">Body</div>
</div>
```

3. **Data attributes para JavaScript**
```html
<button data-action="delete" data-id="123">Eliminar</button>
```

## Workflow de Desarrollo

### 1. Crear componente HTML
```html
<!-- components/mi-componente.html -->
<div class="mi-componente">
  <h3>{{titulo}}</h3>
  <p>{{contenido}}</p>
</div>
```

### 2. Estilizar en CSS
```css
/* assets/css/components.css */
.mi-componente {
  padding: var(--spacing-lg);
  background: var(--color-bg-hover);
}

.mi-componente h3 {
  color: var(--color-accent);
}
```

### 3. Usar en JavaScript
```javascript
const elemento = await ComponentManager.loadElement(
  './components/mi-componente.html',
  { titulo: 'Hola', contenido: 'Mundo' }
);
document.body.appendChild(elemento);
```

## Sistema de Eventos

El sitio usa eventos personalizados para comunicación entre módulos:

```javascript
// Emitir evento
EventManager.emit('post:loaded', { post: postData });

// Escuchar evento
EventManager.listen('post:loaded', (e) => {
  console.log(e.detail.post);
});
```

## Gestión de Estado

Para estado global que varias partes necesitan:

```javascript
// Guardar
StateManager.set('currentUser', userData);

// Obtener
const user = StateManager.get('currentUser');

// Escuchar cambios
EventManager.listen('state:changed', (e) => {
  if (e.detail.key === 'currentUser') {
    // React to change
  }
});
```

## Performance Tips

### 1. Lazy Loading
```javascript
// Cargar componentes solo cuando sea necesario
if (document.querySelector('.blog-section')) {
  loadBlogContent();
}
```

### 2. Debouncing
```javascript
// Para eventos que disparan frecuentemente
window.addEventListener('scroll', Utils.debounce(() => {
  console.log('User scrolled');
}, 300));
```

### 3. Caching
```javascript
// ComponentManager cachea automáticamente
// Pero puedes limpiar si necesitas
ComponentManager.clearCache();
ComponentManager.clearCacheItem('./components/header.html');
```

## Seguridad

### 1. Input Sanitization
```javascript
// Validar inputs del usuario
if (!Utils.isValidEmail(email)) {
  return;
}
```

### 2. XSS Prevention
```javascript
// Usar textContent en lugar de innerHTML cuando sea posible
element.textContent = userInput;

// Si necesitas HTML, usar un parser seguro (MarkdownParser)
const html = MarkdownParser.render(userMarkdown);
```

### 3. CSRF Protection
```html
<!-- Para formularios, incluir token -->
<input type="hidden" name="csrf_token" value="{{ csrf_token }}">
```

## Testing

### Manual Testing
1. Desktop (1920px)
2. Tablet (768px)
3. Mobile (375px)
4. Diferentes navegadores

### Automated Testing (Opcional)
```bash
# Validar HTML
npx html-validate *.html

# Validar CSS
npx stylelint assets/css/*.css

# Validar JavaScript
npx eslint assets/js/*.js
```

## Documentación

Cada archivo debe incluir:

```javascript
/**
 * Descripción breve
 * 
 * @param {type} param - Descripción
 * @returns {type} Descripción
 * 
 * @example
 * function();
 */
```

## Mantenimiento

### Actualizar dependencias
```bash
# Si usas npm (para herramientas de desarrollo)
npm update
npm audit fix
```

### Agregar nueva página

1. Crear `nueva-pagina.html`
2. Importar CSS y JS comunes
3. Agregar link en navbar
4. Adicionar lógica en `main.js` si es necesario

### Agregar nuevo componente

1. Crear `components/nuevo-componente.html`
2. Estilizar en `assets/css/components.css`
3. Usar con `ComponentManager.load()`

## Troubleshooting

### Los componentes no cargan
- Verificar rutas relativas
- Revisar console (F12)
- Usar servidor local (no file://)

### Los estilos no se aplican
- Limpiar cache (Ctrl+Shift+R)
- Verificar orden de importación CSS
- Usar DevTools para inspeccionar

### JavaScript no ejecuta
- Verificar orden de scripts
- Revisar console para errores
- Usar debugger: `debugger;` en código

## Checklist de Deploy

- [ ] Todos los links funcionan
- [ ] CSS se carga correctamente
- [ ] JavaScript sin errores
- [ ] Responsive en móvil
- [ ] Meta tags correctas
- [ ] Open Graph tags (opcional)
- [ ] Analytics configurado (opcional)
- [ ] 404.html para GitHub Pages

## Próximos Pasos Opcionales

1. **Dark/Light Theme Toggle**
   - Detectar preferencia de usuario
   - Toggle button en navbar
   - Guardar en localStorage

2. **Search**
   - Buscar en posts
   - Buscar en learning paths

3. **Categories**
   - Filtrar posts por categoría
   - Archivos por fecha

4. **Comments**
   - Sistema de comentarios (Disqus, Utterances)

5. **Analytics**
   - Google Analytics
   - Plausible Analytics

6. **PWA**
   - Service Worker
   - Manifest.json
   - Offline support

7. **Performance**
   - Minificación CSS/JS
   - Compresión de imágenes
   - CDN para assets

---

**Última actualización**: 26 de noviembre de 2025
