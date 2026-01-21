/**
 * APAFA Web - Página de Reuniones
 * Lista de reuniones y asistencia
 */

/**
 * Carga todos los datos necesarios para la página de reuniones
 */
async function loadReunionesData() {
  // Por ahora datos mock ya que no hay reuniones en el sistema actual
  const reuniones = [
    {
      id: 1,
      titulo: "Reunión General de Padres de Familia",
      fecha: "2026-01-15",
      hora: "19:00",
      motivo: "Reunión general programada para tratar temas importantes relacionados con el próximo año escolar, proyectos de mejora y actividades programadas.",
      asistentes: 25,
      total_padres: 6
    }
  ];

  return { reuniones };
}

/**
 * Renderiza la lista de reuniones
 */
function renderReuniones(reuniones) {
  if (!reuniones || reuniones.length === 0) {
    ApafaData.updateElement('#lista-reuniones', `
      <div class="col-12">
        <div class="card card-modern border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
            <h5 class="text-muted mt-3">No hay reuniones programadas</h5>
            <p class="text-muted">Las reuniones aparecerán aquí cuando sean programadas por el comité.</p>
          </div>
        </div>
      </div>
    `);
    return;
  }

  let html = '';
  reuniones.forEach(reunion => {
    const fecha = new Date(reunion.fecha).toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    html += `
      <div class="col-md-6 mb-4">
        <div class="card card-modern border-0 shadow-sm h-100">
          <div class="card-header bg-primary-institution text-white">
            <div class="d-flex align-items-center">
              <div class="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                <i class="bi bi-calendar-event-fill fs-5"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-bold">${reunion.titulo}</h6>
                <small class="opacity-75">
                  <i class="bi bi-clock me-1"></i>${fecha} - ${reunion.hora}
                </small>
              </div>
            </div>
          </div>
          <div class="card-body">
            <p class="card-text text-muted mb-3">${reunion.motivo}</p>

            <div class="row text-center">
              <div class="col-6">
                <div class="bg-success bg-opacity-10 p-2 rounded">
                  <div class="h5 text-success mb-0">${reunion.asistentes}</div>
                  <small class="text-muted">Asistieron</small>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-info bg-opacity-10 p-2 rounded">
                  <div class="h5 text-info mb-0">${reunion.total_padres}</div>
                  <small class="text-muted">Total Padres</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  ApafaData.updateElement('#lista-reuniones', html);
}

/**
 * Renderiza estadísticas de reuniones
 */
function renderEstadisticasReuniones(reuniones) {
  const totalReuniones = reuniones.length;
  const totalAsistentes = reuniones.reduce((sum, r) => sum + r.asistentes, 0);
  const promedioAsistencia = totalReuniones > 0 ? Math.round(totalAsistentes / totalReuniones) : 0;

  ApafaData.updateText('#total-reuniones', totalReuniones);
  ApafaData.updateText('#promedio-asistencia', promedioAsistencia);
}

/**
 * Renderiza toda la página de reuniones
 */
async function renderReunionesPage(data, container) {
  try {
    const { reuniones } = data;

    // Renderizar estadísticas
    renderEstadisticasReuniones(reuniones);

    // Renderizar lista de reuniones
    renderReuniones(reuniones);

    // Ocultar cualquier mensaje de carga
    ApafaData.toggleElement('.loading-spinner', false);

  } catch (error) {
    console.error('Error renderizando página de reuniones:', error);
    ApafaData.showError('#main-content', 'Error al cargar la información de reuniones');
  }
}

/**
 * Inicializa la página de reuniones
 */
async function initReuniones() {
  await ApafaData.initializePage(
    loadReunionesData,
    renderReunionesPage,
    '#main-content'
  );
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initReuniones);