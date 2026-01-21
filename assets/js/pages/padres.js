/**
 * APAFA Web - Página de Socios APAFA
 * Lista de padres con estado de contribuciones
 */

/**
 * Carga todos los datos necesarios para la página de padres
 */
async function loadPadresData() {
  // Cargar datos principales
  const [padres, resumenFinanciero, stats] = await Promise.all([
    ApafaData.loadDataWithFallback('padres', []),
    ApafaData.loadDataWithFallback('resumen_financiero', {
      recaudacion_esperada: 660,
      total_recaudado: 0,
      porcentaje_cumplimiento: 0,
      meta_anual: 1200
    }),
    ApafaData.loadDataWithFallback('stats', {
      verde: 0,
      amarillo: 0,
      rojo: 0
    })
  ]);

  return {
    padres,
    resumenFinanciero,
    stats
  };
}

/**
 * Renderiza la información general de contribuciones
 */
function renderInformacionGeneral(data) {
  const { resumenFinanciero } = data;

  // Meta anual
  ApafaData.updateText('#meta-anual', ApafaData.formatCurrency(resumenFinanciero.meta_anual || 1200));

  // Porcentaje completado
  ApafaData.updateText('#porcentaje-completado', ApafaData.formatPercentage(resumenFinanciero.porcentaje_cumplimiento || 0));

  // Porcentaje pendiente
  const pendiente = 100 - (resumenFinanciero.porcentaje_cumplimiento || 0);
  ApafaData.updateText('#porcentaje-pendiente', ApafaData.formatPercentage(pendiente));

  // Timestamp de última actualización
  const now = new Date().toLocaleString('es-PE');
  ApafaData.updateText('#ultima-actualizacion', now);
}

/**
 * Renderiza las pestañas con conteos
 */
function renderPestanas(data) {
  const { stats } = data;

  // Contribuciones completas
  ApafaData.updateText('#conteo-completos', stats.verde || 0);

  // Contribuciones en proceso
  const enProceso = (stats.amarillo || 0) + (stats.rojo || 0);
  ApafaData.updateText('#conteo-proceso', enProceso);
}

/**
 * Renderiza la tabla de contribuciones completas
 */
function renderContribucionesCompletas(padresCompletos) {
  if (!padresCompletos || padresCompletos.length === 0) {
    ApafaData.updateElement('#tabla-completos', `
      <tr>
        <td colspan="4" class="text-center text-muted py-4">
          <i class="bi bi-info-circle me-2"></i>
          No hay contribuciones completas registradas
        </td>
      </tr>
    `);
    return;
  }

  let html = '';
  padresCompletos.slice(0, 10).forEach(padre => { // Limitar a 10
    html += `
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <div class="bg-success bg-opacity-20 text-success rounded-circle p-2 me-3">
              <i class="bi bi-person-fill"></i>
            </div>
            <div>
              <strong>${padre.nombre_completo}</strong><br>
              <small class="text-muted">ID: ${padre.dni_parcial}</small>
            </div>
          </div>
        </td>
        <td class="text-center">
          <div class="progress" style="height: 8px; width: 80px; margin: 0 auto;">
            <div class="progress-bar bg-success" style="width: 100%"></div>
          </div>
        </td>
        <td class="text-center fw-bold text-success">${ApafaData.formatCurrency(padre.total_pagado)}</td>
        <td class="text-center">
          <span class="badge bg-success">
            <i class="bi bi-check-circle me-1"></i>Completo
          </span>
        </td>
      </tr>
    `;
  });

  ApafaData.updateElement('#tabla-completos', html);
}

/**
 * Renderiza la tabla de contribuciones en proceso
 */
function renderContribucionesProceso(padresPendientes, recaudacionEsperada) {
  if (!padresPendientes || padresPendientes.length === 0) {
    ApafaData.updateElement('#tabla-proceso', `
      <tr>
        <td colspan="5" class="text-center text-muted py-4">
          <i class="bi bi-info-circle me-2"></i>
          No hay contribuciones pendientes registradas
        </td>
      </tr>
    `);
    return;
  }

  let html = '';
  padresPendientes
    .sort((a, b) => b.total_pagado - a.total_pagado) // Más pagado primero
    .slice(0, 10) // Limitar a 10
    .forEach(padre => {
      const porcentaje = recaudacionEsperada > 0 ? (padre.total_pagado / recaudacionEsperada) * 100 : 0;
      const badgeClass = padre.estado_pago === 'pendiente' ? 'bg-danger text-white' : 'bg-warning text-dark';
      const iconClass = padre.estado_pago === 'pendiente' ? 'bi-x-circle' : 'bi-clock';
      const estadoTexto = padre.estado_pago === 'pendiente' ? 'Pendiente' : 'En Progreso';

      html += `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <div class="bg-warning bg-opacity-20 text-warning rounded-circle p-2 me-3">
                <i class="bi bi-person-fill"></i>
              </div>
              <div>
                <strong>${padre.nombre_completo}</strong><br>
                <small class="text-muted">ID: ${padre.dni_parcial}</small>
              </div>
            </div>
          </td>
          <td class="text-center">
            <div class="progress" style="height: 8px; width: 80px; margin: 0 auto;">
              <div class="progress-bar bg-warning" style="width: ${Math.min(porcentaje, 100)}%"></div>
            </div>
            <small class="text-muted">${porcentaje.toFixed(0)}%</small>
          </td>
          <td class="text-center fw-bold text-warning">${ApafaData.formatCurrency(padre.total_pagado)}</td>
          <td class="text-center fw-bold text-alert-institution">${ApafaData.formatCurrency(padre.faltante)}</td>
          <td class="text-center">
            <span class="badge ${badgeClass}">
              <i class="bi ${iconClass} me-1"></i>${estadoTexto}
            </span>
          </td>
        </tr>
      `;
    });

  ApafaData.updateElement('#tabla-proceso', html);
}

/**
 * Renderiza toda la página de padres
 */
async function renderPadres(data, container) {
  try {
    const { padres, resumenFinanciero, stats } = data;

    // Renderizar información general
    renderInformacionGeneral(data);
    renderPestanas(data);

    // Filtrar padres por estado
    const padresCompletos = padres.filter(p => p.estado_pago === 'completo');
    const padresPendientes = padres.filter(p => p.estado_pago !== 'completo');

    // Renderizar tablas
    renderContribucionesCompletas(padresCompletos);
    renderContribucionesProceso(padresPendientes, resumenFinanciero.recaudacion_esperada);

    // Ocultar cualquier mensaje de carga
    ApafaData.toggleElement('.loading-spinner', false);

  } catch (error) {
    console.error('Error renderizando página de padres:', error);
    ApafaData.showError('#main-content', 'Error al cargar la información de socios');
  }
}

/**
 * Inicializa la página de padres
 */
async function initPadres() {
  await ApafaData.initializePage(
    loadPadresData,
    renderPadres,
    '#main-content'
  );
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initPadres);