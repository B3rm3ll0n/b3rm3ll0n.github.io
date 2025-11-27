/* ============================================
   UTILS.JS - Funciones auxiliares reutilizables
   ============================================ */

/**
 * Utilidades generales y helpers para el proyecto
 */
const Utils = {
  /**
   * Realiza una petición fetch con manejo de errores
   * @param {string} url - URL a obtener
   * @param {object} options - Opciones adicionales para fetch
   * @returns {Promise<Response>} Respuesta de fetch
   */
  async fetch(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.error(`Error en fetch de ${url}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene contenido de un archivo de texto
   * @param {string} path - Ruta del archivo
   * @returns {Promise<string>} Contenido del archivo
   */
  async fetchText(path) {
    const response = await this.fetch(path);
    return await response.text();
  },

  /**
   * Obtiene y parsea JSON
   * @param {string} path - Ruta del archivo JSON
   * @returns {Promise<object>} Objeto parseado
   */
  async fetchJSON(path) {
    const response = await this.fetch(path);
    return await response.json();
  },

  /**
   * Debounce - Retrasa la ejecución de una función
   * @param {Function} func - Función a ejecutar
   * @param {number} wait - Milisegundos de espera
   * @returns {Function} Función con debounce
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle - Limita la ejecución de una función
   * @param {Function} func - Función a ejecutar
   * @param {number} limit - Milisegundos mínimo entre ejecuciones
   * @returns {Function} Función con throttle
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Formatea una fecha
   * @param {Date|string} date - Fecha a formatear
   * @param {string} format - Formato deseado (default: 'es-ES')
   * @returns {string} Fecha formateada
   */
  formatDate(date, format = 'es-ES') {
    const d = new Date(date);
    return d.toLocaleDateString(format, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Formatea una fecha y hora
   * @param {Date|string} date - Fecha a formatear
   * @returns {string} Fecha y hora formateada
   */
  formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleString('es-ES');
  },

  /**
   * Convierte slug a título legible
   * @param {string} slug - Slug a convertir
   * @returns {string} Título formateado
   */
  slugToTitle(slug) {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  },

  /**
   * Convierte título a slug
   * @param {string} title - Título a convertir
   * @returns {string} Slug
   */
  titleToSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Obtiene parámetros de URL
   * @param {string} param - Nombre del parámetro
   * @returns {string|null} Valor del parámetro
   */
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * Obtiene todos los parámetros de URL
   * @returns {object} Objeto con parámetros
   */
  getAllQueryParams() {
    const params = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },

  /**
   * Detecta si está en mobile
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth < 768;
  },

  /**
   * Detecta si está en tablet
   * @returns {boolean}
   */
  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  /**
   * Detecta si está en desktop
   * @returns {boolean}
   */
  isDesktop() {
    return window.innerWidth >= 1024;
  },

  /**
   * Copia texto al portapapeles
   * @param {string} text - Texto a copiar
   * @returns {Promise<boolean>}
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Error al copiar:', err);
      return false;
    }
  },

  /**
   * Genera ID único
   * @returns {string} ID único
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Valida email
   * @param {string} email - Email a validar
   * @returns {boolean}
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Valida URL
   * @param {string} url - URL a validar
   * @returns {boolean}
   */
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Ordena array de objetos por propiedad
   * @param {Array} arr - Array a ordenar
   * @param {string} prop - Propiedad por la que ordenar
   * @param {string} order - 'asc' o 'desc'
   * @returns {Array} Array ordenado
   */
  sortBy(arr, prop, order = 'asc') {
    return [...arr].sort((a, b) => {
      const aVal = a[prop];
      const bVal = b[prop];

      if (order === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  },

  /**
   * Agrupa array de objetos por propiedad
   * @param {Array} arr - Array a agrupar
   * @param {string} prop - Propiedad por la que agrupar
   * @returns {object} Objeto agrupado
   */
  groupBy(arr, prop) {
    return arr.reduce((groups, item) => {
      const key = item[prop];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  },

  /**
   * Filtra array removiendo duplicados
   * @param {Array} arr - Array a filtrar
   * @param {string} prop - Propiedad (opcional)
   * @returns {Array} Array sin duplicados
   */
  unique(arr, prop = null) {
    if (!prop) {
      return [...new Set(arr)];
    }
    const seen = new Set();
    return arr.filter((item) => {
      const key = item[prop];
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  /**
   * Profundidad en objeto (Deep merge)
   * @param {object} target - Objeto destino
   * @param {object} source - Objeto origen
   * @returns {object} Objeto merged
   */
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null) {
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  },

  /**
   * Espera X milisegundos
   * @param {number} ms - Milisegundos
   * @returns {Promise}
   */
  sleep(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Agrega clase a múltiples elementos
   * @param {string|Element} elements - Selector o elemento
   * @param {string} className - Clase a agregar
   */
  addClass(elements, className) {
    const els =
      typeof elements === 'string' ? document.querySelectorAll(elements) : [elements];
    els.forEach((el) => el.classList.add(className));
  },

  /**
   * Remueve clase de múltiples elementos
   * @param {string|Element} elements - Selector o elemento
   * @param {string} className - Clase a remover
   */
  removeClass(elements, className) {
    const els =
      typeof elements === 'string' ? document.querySelectorAll(elements) : [elements];
    els.forEach((el) => el.classList.remove(className));
  },

  /**
   * Toggle clase a elementos
   * @param {string|Element} elements - Selector o elemento
   * @param {string} className - Clase a togglear
   */
  toggleClass(elements, className) {
    const els =
      typeof elements === 'string' ? document.querySelectorAll(elements) : [elements];
    els.forEach((el) => el.classList.toggle(className));
  },

  /**
   * Verifica si elemento tiene clase
   * @param {Element} el - Elemento
   * @param {string} className - Clase a verificar
   * @returns {boolean}
   */
  hasClass(el, className) {
    return el.classList.contains(className);
  },
};

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
