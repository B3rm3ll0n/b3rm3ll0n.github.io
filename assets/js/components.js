/* ============================================
   COMPONENTS.JS - Sistema de carga de componentes
   ============================================ */

/**
 * Gestor de componentes modulares
 * Carga dinámicamente archivos HTML y los inyecta en el DOM
 */
const ComponentManager = {
  // Cache de componentes ya cargados
  cache: {},

  /**
   * Carga un componente HTML y lo inyecta en un elemento
   * @param {string} selector - Selector CSS del elemento contenedor
   * @param {string} path - Ruta del archivo HTML del componente
   * @param {object} data - Datos para pasar al componente (opcional)
   * @returns {Promise<Element>} El elemento inyectado
   */
  async load(selector, path, data = {}) {
    try {
      const element = document.querySelector(selector);
      if (!element) {
        console.error(`Elemento no encontrado: ${selector}`);
        return null;
      }

      // Usar cache si está disponible
      let html;
      if (this.cache[path]) {
        html = this.cache[path];
      } else {
        html = await Utils.fetchText(path);
        this.cache[path] = html;
      }

      // Renderizar con datos si se proporcionan
      if (Object.keys(data).length > 0) {
        html = this.interpolate(html, data);
      }

      element.innerHTML = html;
      return element;
    } catch (error) {
      console.error(`Error al cargar componente ${path}:`, error);
      return null;
    }
  },

  /**
   * Carga un componente y retorna el elemento (sin inyectar)
   * @param {string} path - Ruta del archivo HTML
   * @param {object} data - Datos para pasar al componente
   * @returns {Promise<Element>}
   */
  async loadElement(path, data = {}) {
    try {
      let html;
      if (this.cache[path]) {
        html = this.cache[path];
      } else {
        html = await Utils.fetchText(path);
        this.cache[path] = html;
      }

      if (Object.keys(data).length > 0) {
        html = this.interpolate(html, data);
      }

      const temp = document.createElement('div');
      temp.innerHTML = html;
      return temp.firstElementChild;
    } catch (error) {
      console.error(`Error al cargar elemento ${path}:`, error);
      return null;
    }
  },

  /**
   * Carga múltiples componentes en paralelo
   * @param {object} components - { selector: path, ... }
   * @returns {Promise<object>} Objeto con elementos cargados
   */
  async loadMultiple(components) {
    const promises = Object.entries(components).map(([selector, path]) =>
      this.load(selector, path).catch((e) => {
        console.error(`Error cargando ${selector}:`, e);
        return null;
      })
    );

    const results = await Promise.all(promises);
    const loadedComponents = {};

    Object.keys(components).forEach((selector, i) => {
      loadedComponents[selector] = results[i];
    });

    return loadedComponents;
  },

  /**
   * Interpola variables en HTML
   * Usa sintaxis {{variable}} para variables
   * @private
   */
  interpolate(html, data) {
    return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  },

  /**
   * Limpia el cache
   */
  clearCache() {
    this.cache = {};
  },

  /**
   * Limpia un componente específico del cache
   * @param {string} path - Ruta del componente
   */
  clearCacheItem(path) {
    delete this.cache[path];
  },
};

/**
 * Gestor de eventos delegados y global
 */
const EventManager = {
  listeners: {},

  /**
   * Registra un listener delegado
   * @param {string} selector - Selector CSS
   * @param {string} event - Nombre del evento
   * @param {Function} handler - Función handler
   */
  on(selector, event, handler) {
    const key = `${selector}:${event}`;
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(handler);

    document.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        this.listeners[key].forEach((h) => h.call(e.target, e));
      }
    });
  },

  /**
   * Emite un evento personalizado
   * @param {string} eventName - Nombre del evento
   * @param {object} detail - Datos del evento
   */
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  },

  /**
   * Escucha eventos personalizados
   * @param {string} eventName - Nombre del evento
   * @param {Function} handler - Función handler
   */
  listen(eventName, handler) {
    document.addEventListener(eventName, handler);
  },

  /**
   * Deja de escuchar eventos personalizados
   * @param {string} eventName - Nombre del evento
   * @param {Function} handler - Función handler
   */
  unlisten(eventName, handler) {
    document.removeEventListener(eventName, handler);
  },
};

/**
 * Gestor de estados globales simple
 */
const StateManager = {
  state: {},

  /**
   * Obtiene valor del estado
   * @param {string} key - Clave del estado
   * @returns {*}
   */
  get(key) {
    return this.state[key];
  },

  /**
   * Establece valor del estado
   * @param {string} key - Clave del estado
   * @param {*} value - Valor
   */
  set(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    
    // Emitir evento de cambio
    EventManager.emit('state:changed', {
      key,
      oldValue,
      newValue: value,
    });
  },

  /**
   * Actualiza estado (merge)
   * @param {object} obj - Objeto a mergear
   */
  update(obj) {
    Object.keys(obj).forEach((key) => {
      this.set(key, obj[key]);
    });
  },

  /**
   * Obtiene todo el estado
   * @returns {object}
   */
  getAll() {
    return { ...this.state };
  },

  /**
   * Limpia el estado
   */
  clear() {
    this.state = {};
  },
};

/**
 * Gestor de notificaciones/toast
 */
const NotificationManager = {
  /**
   * Muestra notificación
   * @param {string} message - Mensaje
   * @param {string} type - 'success', 'error', 'info', 'warning'
   * @param {number} duration - Duración en ms (0 = sin auto-dismiss)
   */
  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '2000';
    notification.style.maxWidth = '400px';

    document.body.appendChild(notification);

    if (duration > 0) {
      setTimeout(() => {
        notification.remove();
      }, duration);
    }

    return notification;
  },

  /**
   * Notificación de éxito
   */
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  },

  /**
   * Notificación de error
   */
  error(message, duration = 3000) {
    return this.show(message, 'error', duration);
  },

  /**
   * Notificación de info
   */
  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  },

  /**
   * Notificación de advertencia
   */
  warning(message, duration = 3000) {
    return this.show(message, 'warning', duration);
  },
};

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ComponentManager,
    EventManager,
    StateManager,
    NotificationManager,
  };
}