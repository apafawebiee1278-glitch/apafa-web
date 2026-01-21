/**
 * APAFA Web - Página de Inicio (Dashboard)
 * Carga y muestra estadísticas principales
 */

/**
 * Carga todos los datos necesarios para la página de inicio
 */
async function loadDashboardData() {
  // Cargar datos principales
  const [estadisticas, resumenFinanciero, conceptosPago, comiteApafa] = await Promise.all([
    ApafaData.loadDataWithFallback('stats', {
      socios_apafa: 0,
      total_padres: 6,
      verde: 0,
      amarillo: 3,
      rojo: 3
    }),
    ApafaData.loadDataWithFallback('resumen_financiero', {
      total_recaudado: 0,
      recaudacion_esperada: 660,
      diferencia: 660,
      porcentaje_cumplimiento: 0
    }),
    ApafaData.loadDataWithFallback('conceptos_pago', {
      conceptos: []
    }),
    ApafaData.loadDataWithFallback('comite_apafa', {
      miembros: [],
      directivos: [],
      vocales: []
    })
  ]);

  return {
    estadisticas,
    resumenFinanciero,
    conceptosPago,
    comiteApafa
  };
}

/**
 * Renderiza la sección de estadísticas rápidas
 */
function renderEstadisticasRapidas(data) {
  const { estadisticas, resumenFinanciero } = data;

  // Socios APAFA
  ApafaData.updateText('#socios-apafa-count', estadisticas.socios_apafa || 0);

  // Total recaudado
  ApafaData.updateText('#total-recaudado', ApafaData.formatCurrency(resumenFinanciero.total_recaudado || 0));

  // Comunicados activos (hardcoded por ahora)
  ApafaData.updateText('#comunicados-activos', '12');

  // Pendiente (calculado)
  const pendiente = (resumenFinanciero.recaudacion_esperada || 0) - (resumenFinanciero.total_recaudado || 0);
  ApafaData.updateText('#monto-pendiente', ApafaData.formatCurrency(Math.max(0, pendiente)));
}

/**
 * Renderiza la sección de información de cuotas
 */
function renderCuotas(data) {
  const { conceptosPago } = data;

  if (!conceptosPago.conceptos || conceptosPago.conceptos.length === 0) {
    // Datos por defecto
    ApafaData.updateElement('#cuota-obligatoria', `
      <strong>Cuota APAFA 2026-2027:</strong><br>
      <span class="h4 text-accent-institution">S/ 150.00</span>
    `);
    return;
  }

  // Buscar cuota obligatoria APAFA
  const cuotaObligatoria = conceptosPago.conceptos.find(c => c.obligatorio && c.nombre.toLowerCase().includes('apafa'));

  if (cuotaObligatoria) {
    ApafaData.updateElement('#cuota-obligatoria', `
      <strong>${cuotaObligatoria.nombre}:</strong><br>
      <span class="h4 text-accent-institution">${ApafaData.formatCurrency(cuotaObligatoria.monto_limite)}</span>
    `);
  } else {
    ApafaData.updateElement('#cuota-obligatoria', `
      <strong>Cuota APAFA 2026-2027:</strong><br>
      <span class="h4 text-accent-institution">S/ 150.00</span>
    `);
  }
}

/**
 * Renderiza la sección de contribuciones adicionales
 */
function renderContribucionesAdicionales(data) {
  const { conceptosPago } = data;

  if (!conceptosPago.conceptos || conceptosPago.conceptos.length === 0) {
    // Datos por defecto
    ApafaData.updateElement('#contribuciones-adicionales', `
      <div class="row">
        <div class="col-md-6">
          <strong>Proyecto Biblioteca:</strong> S/ 25.00 (Opcional)<br>
          <small class="text-muted">Para renovación de material educativo</small>
        </div>
        <div class="col-md-6">
          <strong>Actividad Cultural:</strong> S/ 15.00 (Opcional)<br>
          <small class="text-muted">Viaje de estudios y actividades culturales</small>
        </div>
      </div>
    `);
    return;
  }

  const conceptosOpcionales = conceptosPago.conceptos.filter(c => !c.obligatorio);

  if (conceptosOpcionales.length === 0) {
    ApafaData.updateElement('#contribuciones-adicionales', `
      <div class="text-center text-muted py-3">
        <i class="bi bi-info-circle me-2"></i>
        No hay contribuciones adicionales disponibles en este momento.
      </div>
    `);
    return;
  }

  let html = '<div class="row">';
  conceptosOpcionales.forEach((concepto, index) => {
    if (index % 2 === 0 && index > 0) {
      html += '</div><div class="row mt-3">';
    }
    html += `
      <div class="col-md-6 mb-3">
        <strong>${concepto.nombre}:</strong> ${ApafaData.formatCurrency(concepto.monto_limite)} (Opcional)<br>
        <small class="text-muted">${concepto.descripcion || 'Contribución adicional voluntaria'}</small>
      </div>
    `;
  });
  html += '</div>';

  ApafaData.updateElement('#contribuciones-adicionales', html);
}

/**
 * Renderiza la sección del comité APAFA
 */
function renderComiteApafa(data) {
  const { comiteApafa } = data;

  if (!comiteApafa.directivos || comiteApafa.directivos.length === 0) {
    // Datos por defecto
    ApafaData.updateElement('#comite-directivos', `
      <li class="mb-2"><i class="bi bi-person-circle me-2 text-primary-institution"></i><strong>Presidente:</strong> [Nombre del Presidente]</li>
      <li class="mb-2"><i class="bi bi-person-circle me-2 text-primary-institution"></i><strong>Vicepresidente:</strong> [Nombre del Vicepresidente]</li>
      <li class="mb-2"><i class="bi bi-person-circle me-2 text-primary-institution"></i><strong>Secretario:</strong> [Nombre del Secretario]</li>
      <li class="mb-2"><i class="bi bi-person-circle me-2 text-primary-institution"></i><strong>Tesorero:</strong> [Nombre del Tesorero]</li>
    `);

    ApafaData.updateElement('#comite-vocales', `
      <li class="mb-2"><i class="bi bi-person-circle me-2 text-accent-institution"></i><strong>Vocal:</strong> [Nombre del Vocal]</li>
      <li class="mb-2"><i class="bi bi-person-circle me-2 text-accent-institution"></i><strong>Vocal:</strong> [Nombre del Vocal]</li>
    `);
    return;
  }

  // Renderizar directivos
  let directivosHtml = '';
  comiteApafa.directivos.forEach(directivo => {
    directivosHtml += `<li class="mb-2"><i class="bi bi-person-circle me-2 text-primary-institution"></i><strong>${directivo.cargo}:</strong> ${directivo.nombre_completo}</li>`;
  });
  ApafaData.updateElement('#comite-directivos', directivosHtml);

  // Renderizar vocales
  let vocalesHtml = '';
  if (comiteApafa.vocales && comiteApafa.vocales.length > 0) {
    comiteApafa.vocales.forEach(vocal => {
      vocalesHtml += `<li class="mb-2"><i class="bi bi-person-circle me-2 text-accent-institution"></i><strong>${vocal.cargo}:</strong> ${vocal.nombre_completo}</li>`;
    });
  }

  // Renderizar colaboradores si existen
  if (comiteApafa.colaboradores && comiteApafa.colaboradores.length > 0) {
    vocalesHtml += '<h6 class="text-accent-institution mb-3 mt-4">Colaboradores</h6><ul class="list-unstyled">';
    comiteApafa.colaboradores.forEach(colaborador => {
      vocalesHtml += `<li class="mb-2"><i class="bi bi-person-circle me-2 text-secondary-institution"></i>${colaborador.nombre_completo}</li>`;
    });
    vocalesHtml += '</ul>';
  }

  ApafaData.updateElement('#comite-vocales', vocalesHtml);
}

/**
 * Renderiza toda la página de inicio
 */
async function renderDashboard(data, container) {
  try {
    // Renderizar todas las secciones
    renderEstadisticasRapidas(data);
    renderCuotas(data);
    renderContribucionesAdicionales(data);
    renderComiteApafa(data);

    // Ocultar cualquier mensaje de carga
    ApafaData.toggleElement('.loading-spinner', false);

  } catch (error) {
    console.error('Error renderizando dashboard:', error);
    ApafaData.showError('#main-content', 'Error al cargar el dashboard');
  }
}

/**
 * Inicializa la página de inicio
 */
async function initDashboard() {
  await ApafaData.initializePage(
    loadDashboardData,
    renderDashboard,
    '#main-content'
  );
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initDashboard);