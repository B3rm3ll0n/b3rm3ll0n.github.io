/* ============================================
   MARKDOWN.JS - Parser y renderizador Markdown
   ============================================ */

/**
 * Parser Markdown simple pero funcional
 * Soporta: headings, bold, italic, links, lists, code blocks, etc.
 */
const MarkdownParser = {
  /**
   * Renderiza contenido Markdown a HTML
   * @param {string} markdown - Contenido en Markdown
   * @returns {string} HTML renderizado
   */
  render(markdown) {
    if (!markdown) return '';

    let html = markdown;

    // Escapar HTML especial (excepto lo que queremos procesar)
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Bloques de código (triple backtick)
    html = this.renderCodeBlocks(html);

    // Headings
    html = this.renderHeadings(html);

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');

    // Bold e italic
    html = this.renderFormatting(html);

    // Links
    html = this.renderLinks(html);

    // Listas ordenadas
    html = this.renderOrderedLists(html);

    // Listas desordenadas
    html = this.renderUnorderedLists(html);

    // Párrafos
    html = this.renderParagraphs(html);

    // Citas
    html = this.renderBlockquotes(html);

    // Código inline
    html = this.renderInlineCode(html);

    // Líneas en blanco adicionales
    html = html.replace(/\n\n+/g, '</p><p>');

    return html;
  },

  /**
   * Renderiza bloques de código
   * @private
   */
  renderCodeBlocks(html) {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    return html.replace(codeBlockRegex, (match, language, code) => {
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const lang = language ? ` class="language-${language}"` : '';
      return `<pre><code${lang}>${escaped.trim()}</code></pre>`;
    });
  },

  /**
   * Renderiza headings
   * @private
   */
  renderHeadings(html) {
    for (let i = 6; i >= 1; i--) {
      const regex = new RegExp(`^${'#'.repeat(i)} (.+)$`, 'gm');
      html = html.replace(regex, `<h${i}>$1</h${i}>`);
    }
    return html;
  },

  /**
   * Renderiza bold e italic
   * @private
   */
  renderFormatting(html) {
    // Bold: **texto** o __texto__
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic: *texto* o _texto_
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    return html;
  },

  /**
   * Renderiza links
   * @private
   */
  renderLinks(html) {
    // [texto](url)
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
    return html;
  },

  /**
   * Renderiza listas ordenadas
   * @private
   */
  renderOrderedLists(html) {
    const lines = html.split('\n');
    let result = [];
    let inOrderedList = false;

    for (let line of lines) {
      const match = line.match(/^\d+\.\s(.+)$/);

      if (match) {
        if (!inOrderedList) {
          result.push('<ol>');
          inOrderedList = true;
        }
        result.push(`<li>${match[1]}</li>`);
      } else {
        if (inOrderedList) {
          result.push('</ol>');
          inOrderedList = false;
        }
        result.push(line);
      }
    }

    if (inOrderedList) {
      result.push('</ol>');
    }

    return result.join('\n');
  },

  /**
   * Renderiza listas desordenadas
   * @private
   */
  renderUnorderedLists(html) {
    const lines = html.split('\n');
    let result = [];
    let inList = false;

    for (let line of lines) {
      const match = line.match(/^[-*+]\s(.+)$/);

      if (match) {
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        result.push(`<li>${match[1]}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        result.push(line);
      }
    }

    if (inList) {
      result.push('</ul>');
    }

    return result.join('\n');
  },

  /**
   * Renderiza párrafos
   * @private
   */
  renderParagraphs(html) {
    const lines = html.split('\n');
    let result = [];
    let inParagraph = false;

    for (let line of lines) {
      line = line.trim();

      // Saltar líneas vacías y elementos especiales
      if (!line || line.startsWith('<')) {
        if (inParagraph) {
          result.push('</p>');
          inParagraph = false;
        }
        result.push(line);
      } else {
        if (!inParagraph) {
          result.push('<p>');
          inParagraph = true;
        }
        result.push(line);
      }
    }

    if (inParagraph) {
      result.push('</p>');
    }

    return result.join('\n');
  },

  /**
   * Renderiza blockquotes
   * @private
   */
  renderBlockquotes(html) {
    const lines = html.split('\n');
    let result = [];
    let inBlockquote = false;

    for (let line of lines) {
      if (line.startsWith('> ')) {
        if (!inBlockquote) {
          result.push('<blockquote>');
          inBlockquote = true;
        }
        result.push(`<p>${line.substring(2)}</p>`);
      } else {
        if (inBlockquote) {
          result.push('</blockquote>');
          inBlockquote = false;
        }
        result.push(line);
      }
    }

    if (inBlockquote) {
      result.push('</blockquote>');
    }

    return result.join('\n');
  },

  /**
   * Renderiza código inline
   * @private
   */
  renderInlineCode(html) {
    // `código`
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    return html;
  },

  /**
   * Extrae metadatos YAML del inicio
   * @param {string} markdown - Contenido Markdown
   * @returns {object} { metadata, content }
   */
  extractMetadata(markdown) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
      return { metadata: {}, content: markdown };
    }

    const metadata = {};
    const lines = match[1].split('\n');

    lines.forEach((line) => {
      const [key, value] = line.split(':').map((s) => s.trim());
      if (key && value) {
        metadata[key] = value;
      }
    });

    return {
      metadata,
      content: match[2],
    };
  },

  /**
   * Renderiza Markdown con soporte para metadatos
   * @param {string} markdown - Contenido completo
   * @returns {object} { html, metadata }
   */
  renderWithMetadata(markdown) {
    const { metadata, content } = this.extractMetadata(markdown);
    const html = this.render(content);
    return { html, metadata };
  },
};

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarkdownParser;
}
