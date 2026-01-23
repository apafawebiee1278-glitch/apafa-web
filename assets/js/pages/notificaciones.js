// Notificaciones - Funciones para cargar y mostrar notificaciones

async function initNotificaciones() {
    try {
        const notificacionesData = await ApafaData.loadDataWithFallback('notificaciones', { notificaciones: [], total_notificaciones: 0 });
        renderNotificaciones(notificacionesData);
    } catch (error) {
        console.error('Error inicializando notificaciones:', error);
        showErrorNotificaciones('Error al cargar las notificaciones: ' + error.message);
    }
}

function renderNotificaciones(data) {
    try {
        // Ocultar loading y mostrar contenido
        ApafaData.toggleElement('loading-notificaciones', false);
        ApafaData.toggleElement('error-notificaciones', false);
        ApafaData.toggleElement('contenido-notificaciones', true);

        const notificaciones = data.notificaciones || [];
        const total = data.total_notificaciones || notificaciones.length;

        // Actualizar estadísticas
        ApafaData.updateText('total-notificaciones', total.toString());
        ApafaData.updateText('notificaciones-eventos', notificaciones.filter(n => n.fecha_evento).length.toString());
        ApafaData.updateText('notificaciones-generales', notificaciones.filter(n => !n.fecha_evento).length.toString());

        // Renderizar lista de notificaciones
        renderListaNotificaciones(notificaciones);

    } catch (error) {
        console.error('Error renderizando notificaciones:', error);
        showErrorNotificaciones('Error al mostrar las notificaciones: ' + error.message);
    }
}

function renderListaNotificaciones(notificaciones) {
    const container = document.getElementById('lista-notificaciones');

    if (!notificaciones || notificaciones.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-bell-slash text-muted fs-1 mb-3"></i>
                <h5 class="text-muted">No hay notificaciones disponibles</h5>
                <p class="text-muted">Las notificaciones aparecerán aquí cuando sean publicadas por el comité APAFA.</p>
            </div>
        `;
        return;
    }

    // Ordenar notificaciones por fecha de publicación (más recientes primero)
    const notificacionesOrdenadas = [...notificaciones].sort((a, b) =>
        new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)
    );

    const html = notificacionesOrdenadas.map(notificacion => {
        const fechaPublicacion = formatDate(notificacion.fecha_publicacion);
        const fechaEvento = notificacion.fecha_evento ? formatDate(notificacion.fecha_evento) : null;
        const horaEvento = notificacion.hora_evento || '';
        const lugarEvento = notificacion.lugar_evento || '';
        const organizador = notificacion.organizador || 'Comité APAFA';

        // Determinar el tipo de badge
        let badgeClass = 'bg-secondary';
        let badgeText = 'General';

        switch (notificacion.tipo) {
            case 'financiero':
                badgeClass = 'bg-success';
                badgeText = 'Financiero';
                break;
            case 'reunion':
                badgeClass = 'bg-primary';
                badgeText = 'Reunión';
                break;
            case 'urgente':
                badgeClass = 'bg-danger';
                badgeText = 'Urgente';
                break;
            case 'evento':
                badgeClass = 'bg-info';
                badgeText = 'Evento';
                break;
            default:
                badgeClass = 'bg-secondary';
                badgeText = 'General';
        }

        return `
            <div class="notificacion-item mb-4 p-4 border rounded bg-light">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="flex-grow-1">
                        <h5 class="fw-bold text-primary-institution mb-2">
                            <i class="bi bi-bell me-2"></i>${notificacion.titulo}
                        </h5>
                        <div class="mb-2">
                            <span class="badge ${badgeClass} me-2">${badgeText}</span>
                            <small class="text-muted">
                                <i class="bi bi-calendar-event me-1"></i>Publicado: ${fechaPublicacion}
                            </small>
                            <small class="text-muted ms-3">
                                <i class="bi bi-person me-1"></i>${organizador}
                            </small>
                        </div>
                    </div>
                </div>

                <div class="notificacion-contenido mb-3">
                    <p class="mb-3">${notificacion.contenido}</p>

                    ${fechaEvento ? `
                        <div class="evento-info p-3 bg-white rounded border-start border-primary">
                            <h6 class="text-primary mb-2">
                                <i class="bi bi-calendar-check me-2"></i>Información del Evento
                            </h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <p class="mb-1">
                                        <i class="bi bi-calendar-date me-2"></i>
                                        <strong>Fecha:</strong> ${fechaEvento}
                                    </p>
                                    ${horaEvento ? `
                                        <p class="mb-1">
                                            <i class="bi bi-clock me-2"></i>
                                            <strong>Hora:</strong> ${horaEvento}
                                        </p>
                                    ` : ''}
                                </div>
                                <div class="col-md-6">
                                    ${lugarEvento ? `
                                        <p class="mb-0">
                                            <i class="bi bi-geo-alt me-2"></i>
                                            <strong>Lugar:</strong> ${lugarEvento}
                                        </p>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

function showErrorNotificaciones(message) {
    ApafaData.toggleElement('loading-notificaciones', false);
    ApafaData.toggleElement('contenido-notificaciones', false);
    ApafaData.toggleElement('error-notificaciones', true);
    ApafaData.updateText('error-message-notificaciones', message);
}