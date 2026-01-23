/**
 * APAFA Web - Data Loader
 * Sistema unificado para cargar datos JSON desde archivos locales
 */

// Configuración base
const CONFIG = {
  basePath: '/apafa-web/data/',
  timeout: 5000, // 5 segundos de timeout
  retries: 2     // Número de reintentos
};

// Cache para datos cargados
const dataCache = new Map();

/**
 * Carga datos JSON desde un archivo
 * @param {string} filename - Nombre del archivo sin extensión
 * @param {boolean} useCache - Si usar cache (default: true)
 * @returns {Promise<Object>} Datos cargados
 */
async function loadData(filename, useCache = true) {
  const cacheKey = filename;

  // Verificar cache
  if (useCache && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }

  const filepath = `${CONFIG.basePath}${filename}.json`;

  for (let attempt = 0; attempt <= CONFIG.retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

      const response = await fetch(filepath, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Guardar en cache
      if (useCache) {
        dataCache.set(cacheKey, data);
      }

      return data;

    } catch (error) {
      console.warn(`Intento ${attempt + 1}/${CONFIG.retries + 1} falló para ${filename}:`, error.message);

      if (attempt === CONFIG.retries) {
        // Último intento falló
        console.error(`Error cargando datos desde ${filename}:`, error);
        throw new Error(`No se pudieron cargar los datos desde ${filename}`);
      }

      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

/**
 * Carga datos con fallback a valores por defecto
 * @param {string} filename - Nombre del archivo
 * @param {Object} defaultData - Datos por defecto si falla la carga
 * @returns {Promise<Object>} Datos cargados o por defecto
 */
async function loadDataWithFallback(filename, defaultData = {}) {
  try {
    return await loadData(filename);
  } catch (error) {
    console.warn(`Usando datos por defecto para ${filename}:`, error.message);
    return defaultData;
  }
}

/**
 * Formatea números como moneda
 * @param {number} amount - Monto a formatear
 * @param {string} currency - Símbolo de moneda (default: 'S/')
 * @returns {string} Monto formateado
 */
function formatCurrency(amount, currency = 'S/') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency} 0.00`;
  }
  return `${currency} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formatea porcentajes
 * @param {number} percentage - Porcentaje a formatear
 * @returns {string} Porcentaje formateado
 */
function formatPercentage(percentage) {
  if (typeof percentage !== 'number' || isNaN(percentage)) {
    return '0.0%';
  }
  return `${percentage.toFixed(1)}%`;
}

/**
 * Actualiza el contenido de un elemento HTML
 * @param {string} selector - Selector CSS
 * @param {string} content - Contenido HTML
 * @param {string} fallback - Contenido alternativo si falla
 */
function updateElement(selector, content, fallback = 'N/A') {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = content || fallback;
  } else {
    console.warn(`Elemento no encontrado: ${selector}`);
  }
}

/**
 * Actualiza el texto de un elemento HTML
 * @param {string} selector - Selector CSS
 * @param {string} text - Texto plano
 * @param {string} fallback - Texto alternativo si falla
 */
function updateText(selector, text, fallback = 'N/A') {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = text || fallback;
    console.log(`Elemento ${selector} actualizado con: ${text || fallback}`);
  } else {
    console.warn(`Elemento no encontrado: ${selector}`);
    console.log('Elementos disponibles en el documento:');
    const allElements = document.querySelectorAll('[id]');
    allElements.forEach(el => {
      if (el.id.includes('notificaciones') || el.id.includes('total')) {
        console.log(`- ${el.id}: ${el.tagName}`);
      }
    });
  }
}

/**
 * Muestra/oculta un elemento
 * @param {string} selector - Selector CSS
 * @param {boolean} show - Si mostrar o ocultar
 */
function toggleElement(selector, show) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = show ? '' : 'none';
  }
}

/**
 * Muestra mensaje de carga
 * @param {string} selector - Selector del contenedor
 * @param {string} message - Mensaje a mostrar
 */
function showLoading(selector, message = 'Cargando...') {
  updateElement(selector, `
    <div class="text-center py-4">
      <div class="spinner-border text-primary-institution" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">${message}</p>
    </div>
  `);
}

/**
 * Muestra mensaje de error
 * @param {string} selector - Selector del contenedor
 * @param {string} message - Mensaje de error
 * @param {string} retryAction - Acción de reintento (opcional)
 */
function showError(selector, message = 'Error al cargar datos', retryAction = null) {
  let html = `
    <div class="alert alert-danger text-center" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      ${message}
  `;

  if (retryAction) {
    html += `<br><button class="btn btn-sm btn-outline-danger mt-2" onclick="${retryAction}">Reintentar</button>`;
  }

  html += '</div>';

  updateElement(selector, html);
}

/**
 * Inicializa la página con carga de datos
 * @param {Function} loadFunction - Función que carga los datos
 * @param {Function} renderFunction - Función que renderiza los datos
 * @param {string} containerSelector - Selector del contenedor principal
 */
async function initializePage(loadFunction, renderFunction, containerSelector = 'main') {
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error(`Contenedor principal no encontrado: ${containerSelector}`);
    return;
  }

  try {
    // Mostrar loading
    showLoading(containerSelector, 'Cargando datos...');

    // Cargar datos
    const data = await loadFunction();

    // Renderizar
    await renderFunction(data, container);

  } catch (error) {
    console.error('Error inicializando página:', error);
    showError(containerSelector, 'Error al cargar la página. Intente recargar.', 'location.reload()');
  }
}

// Exportar funciones globales para uso en HTML
window.ApafaData = {
  loadData,
  loadDataWithFallback,
  formatCurrency,
  formatPercentage,
  updateElement,
  updateText,
  toggleElement,
  showLoading,
  showError,
  initializePage
};