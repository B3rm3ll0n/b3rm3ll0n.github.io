/* ============================================
   MAIN.JS - Inicialización y lógica principal
   ============================================ */

/**
 * Aplicación principal
 */
const App = {
  // Configuración de la app
  config: {
    postsPath: './assets/posts/',
    componentsPath: './components/',
    postsPerPage: 10,
  },

  /**
   * Inicializa la aplicación
   */
  async init() {
    console.log('🚀 Inicializando aplicación...');

    try {
      // Cargar componentes globales
      await this.loadGlobalComponents();

      // Inicializar navegación
      this.initNavigation();

      // Inicializar rutas (si está en index.html)
      if (this.isHomePage()) {
        await this.initHome();
      }

      // Inicializar blog (si está en blog.html)
      if (this.isBlogPage()) {
        await this.initBlog();
      }

      // Inicializar paths (si está en paths.html)
      if (this.isPathsPage()) {
        await this.initPaths();
      }

      // Inicializar listeners globales
      this.initGlobalListeners();

      console.log('✅ Aplicación lista');
    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);
    }
  },

  /**
   * Carga componentes globales (header, footer)
   */
  async loadGlobalComponents() {
    console.log('📦 Cargando componentes globales...');

    const components = {};

    // Cargar header si existe
    if (document.querySelector('header')) {
      components['header'] = `${this.config.componentsPath}header.html`;
    }

    // Cargar footer si existe
    if (document.querySelector('footer')) {
      components['footer'] = `${this.config.componentsPath}footer.html`;
    }

    // Cargar navbar si existe
    if (document.querySelector('[data-component="navbar"]')) {
      components['[data-component="navbar"]'] = `${this.config.componentsPath}navbar.html`;
    }

    if (Object.keys(components).length > 0) {
      await ComponentManager.loadMultiple(components);
      console.log('✅ Componentes globales cargados');
    }
  },

  /**
   * Inicializa navegación
   */
  initNavigation() {
    console.log('📍 Inicializando navegación...');

    const currentPage = this.getCurrentPage();
    const navLinks = document.querySelectorAll('.navbar__link, [data-nav-link]');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || link.getAttribute('data-page');
      if (href && href.includes(currentPage)) {
        link.classList.add('active');
      }
    });

    // Toggle menú mobile
    const navToggle = document.querySelector('[data-nav-toggle]');
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const menu = document.querySelector('.navbar__menu');
        if (menu) {
          menu.classList.toggle('active');
        }
      });
    }

    // Cerrar menú al hacer click en un link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const menu = document.querySelector('.navbar__menu');
        if (menu) {
          menu.classList.remove('active');
        }
      });
    });
  },

  /**
   * Inicializa página de inicio
   */
  async initHome() {
    console.log('🏠 Inicializando página de inicio...');
    // Lógica específica para home
  },

  /**
   * Inicializa página de blog
   */
  async initBlog() {
    console.log('📝 Inicializando blog...');

    try {
      const posts = await this.loadPosts();
      console.log(`Encontrados ${posts.length} posts`);

      if (posts.length > 0) {
        await this.renderBlogPosts(posts);
      } else {
        this.showNoPosts();
      }
    } catch (error) {
      console.error('Error cargando blog:', error);
      NotificationManager.error('Error al cargar los posts');
    }
  },

  /**
   * Inicializa página de paths
   */
  async initPaths() {
    console.log('🛤️ Inicializando paths...');
    // Lógica específica para paths
  },

  /**
   * Carga todos los posts Markdown
   * @returns {Promise<Array>}
   */
  async loadPosts() {
    try {
      // Intenta cargar un índice de posts (si existe)
      // Si no, fallback a cargar posts individuales
      // Este es un placeholder - en producción necesitarías un método mejor

      const posts = [];

      // Simulación: intentar cargar posts comunes
      const commonPosts = [
        'post-1.md',
        'post-2.md',
        'post-3.md',
        'introduccion-hacking-etico.md',
      ];

      for (const postFile of commonPosts) {
        try {
          const path = `${this.config.postsPath}${postFile}`;
          const content = await Utils.fetchText(path);
          const { html, metadata } = MarkdownParser.renderWithMetadata(content);

          posts.push({
            slug: postFile.replace('.md', ''),
            title: metadata.title || Utils.slugToTitle(postFile),
            excerpt: metadata.excerpt || this.extractExcerpt(html),
            date: metadata.date || new Date().toISOString(),
            tags: (metadata.tags || '').split(',').map((t) => t.trim()),
            html,
            metadata,
          });
        } catch (error) {
          // Post no encontrado, continuar
          continue;
        }
      }

      return posts;
    } catch (error) {
      console.error('Error cargando posts:', error);
      return [];
    }
  },

  /**
   * Extrae un excerpt del HTML
   * @private
   */
  extractExcerpt(html, length = 150) {
    const text = html.replace(/<[^>]*>/g, ''); // Remover HTML
    return text.substring(0, length) + (text.length > length ? '...' : '');
  },

  /**
   * Renderiza posts en el blog
   * @private
   */
  async renderBlogPosts(posts) {
    const container = document.querySelector('[data-posts-container]');
    if (!container) return;

    container.innerHTML = ''; // Limpiar

    for (const post of posts) {
      const postCard = await ComponentManager.loadElement(
        `${this.config.componentsPath}post-card.html`,
        {
          title: post.title,
          excerpt: post.excerpt,
          date: Utils.formatDate(post.date),
          tags: post.tags.join(', '),
          link: `blog.html?post=${post.slug}`,
        }
      );

      if (postCard) {
        container.appendChild(postCard);
      }
    }
  },

  /**
   * Muestra mensaje de no posts
   * @private
   */
  showNoPosts() {
    const container = document.querySelector('[data-posts-container]');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-info">
          <p>Aún no hay posts. ¡Vuelve pronto!</p>
        </div>
      `;
    }
  },

  /**
   * Inicializa listeners globales
   * @private
   */
  initGlobalListeners() {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Escuchar cambios de estado
    EventManager.listen('state:changed', (e) => {
      console.log('Estado cambió:', e.detail);
    });
  },

  /**
   * Obtiene la página actual
   * @private
   */
  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('blog')) return 'blog';
    if (path.includes('paths')) return 'paths';
    return 'index';
  },

  /**
   * Verifica si está en home
   * @private
   */
  isHomePage() {
    return this.getCurrentPage() === 'index';
  },

  /**
   * Verifica si está en blog
   * @private
   */
  isBlogPage() {
    return this.getCurrentPage() === 'blog';
  },

  /**
   * Verifica si está en paths
   * @private
   */
  isPathsPage() {
    return this.getCurrentPage() === 'paths';
  },
};

/**
 * Inicia la aplicación cuando el DOM esté listo
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}
