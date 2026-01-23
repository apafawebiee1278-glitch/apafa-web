// Notificaciones - Funciones para cargar y mostrar notificaciones

async function initNotificaciones() {
    try {
        console.log('Iniciando carga de notificaciones...');
        const notificacionesData = await ApafaData.loadDataWithFallback('notificaciones', { notificaciones: [], total_notificaciones: 0 });
        console.log('Datos de notificaciones cargados:', notificacionesData);
        renderNotificaciones(notificacionesData);
    } catch (error) {
        console.error('Error inicializando notificaciones:', error);
        showErrorNotificaciones('Error al cargar las notificaciones: ' + error.message);
    }

    console.log('Función initNotificaciones completada');
}

function renderNotificaciones(data) {
    try {
        console.log('Renderizando notificaciones con data:', data);

        // Verificar que data existe
        if (!data) {
            throw new Error('Datos de notificaciones no disponibles');
        }

        console.log('Ocultando loading y mostrando contenido...');

        // Verificar estado inicial de los elementos
        console.log('Estado inicial de elementos:');
        console.log('- loading-notificaciones visible:', document.getElementById('loading-notificaciones')?.style.display !== 'none');
        console.log('- contenido-notificaciones visible:', document.getElementById('contenido-notificaciones')?.style.display !== 'none');

        // Ocultar loading y mostrar contenido
        ApafaData.toggleElement('#loading-notificaciones', false);
        ApafaData.toggleElement('#error-notificaciones', false);
        ApafaData.toggleElement('#contenido-notificaciones', true);

        // Verificar estado final
        console.log('Estado final de elementos:');
        console.log('- loading-notificaciones visible:', document.getElementById('loading-notificaciones')?.style.display !== 'none');
        console.log('- contenido-notificaciones visible:', document.getElementById('contenido-notificaciones')?.style.display !== 'none');

        const notificaciones = data.notificaciones || [];
        const total = data.total_notificaciones || notificaciones.length;

        console.log(`Procesando ${notificaciones.length} notificaciones, total: ${total}`);

        // Actualizar estadísticas inmediatamente después de mostrar el contenido
        console.log('Actualizando estadísticas...');
        const eventosCount = notificaciones.filter(n => n.fecha_evento && n.lugar_evento && n.lugar_evento.trim() !== '').length;
        const generalesCount = notificaciones.filter(n => !n.fecha_evento || !n.lugar_evento || n.lugar_evento.trim() === '').length;

        console.log(`Conteo: Total=${total}, Eventos=${eventosCount}, Generales=${generalesCount}`);

        ApafaData.updateText('#total-notificaciones', total.toString());
        ApafaData.updateText('#notificaciones-eventos', eventosCount.toString());
        ApafaData.updateText('#notificaciones-generales', generalesCount.toString());

        // Renderizar lista de notificaciones
        renderListaNotificaciones(notificaciones);

    } catch (error) {
        console.error('Error renderizando notificaciones:', error);
        showErrorNotificaciones('Error al mostrar las notificaciones: ' + error.message);
    }
}

function renderListaNotificaciones(notificaciones) {
    console.log('Renderizando lista de notificaciones:', notificaciones);
    console.log('Número de notificaciones a renderizar:', notificaciones.length);
    const container = document.getElementById('lista-notificaciones');

    if (!container) {
        console.error('Contenedor lista-notificaciones no encontrado');
        console.log('Elementos disponibles en el documento:');
        const allElements = document.querySelectorAll('[id]');
        allElements.forEach(el => {
            if (el.id.includes('lista')) {
                console.log(`- ${el.id}: ${el.tagName}`);
            }
        });
        throw new Error('Elemento lista-notificaciones no encontrado en el DOM');
    }

    console.log('Contenedor encontrado, procediendo a generar HTML...');

    if (!notificaciones || notificaciones.length === 0) {
        console.log('No hay notificaciones para mostrar');
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

    console.log('HTML generado completo:', html);
    console.log('Insertando HTML en contenedor...');
    console.log('Contenedor antes de inserción - display:', window.getComputedStyle(container).display);
    console.log('Contenedor antes de inserción - visibility:', window.getComputedStyle(container).visibility);
    console.log('Contenedor antes de inserción - innerHTML length:', container.innerHTML.length);

    container.innerHTML = html;

    console.log('HTML insertado correctamente en contenedor');
    console.log('Contenedor después de inserción - display:', window.getComputedStyle(container).display);
    console.log('Contenedor después de inserción - visibility:', window.getComputedStyle(container).visibility);
    console.log('Contenedor después de inserción - innerHTML length:', container.innerHTML.length);
    console.log('Contenedor después de inserción - childElementCount:', container.childElementCount);

    // Verificar si los elementos hijos son visibles
    if (container.children.length > 0) {
        console.log('Primer elemento hijo - display:', window.getComputedStyle(container.children[0]).display);
        console.log('Primer elemento hijo - visibility:', window.getComputedStyle(container.children[0]).visibility);
        console.log('Primer elemento hijo - opacity:', window.getComputedStyle(container.children[0]).opacity);
        console.log('Primer elemento hijo - position:', window.getComputedStyle(container.children[0]).position);
        console.log('Primer elemento hijo - z-index:', window.getComputedStyle(container.children[0]).zIndex);
    }

    // Verificar contenedor padre
    const parent = container.parentElement;
    if (parent) {
        console.log('Contenedor padre - display:', window.getComputedStyle(parent).display);
        console.log('Contenedor padre - visibility:', window.getComputedStyle(parent).visibility);
        console.log('Contenedor padre - overflow:', window.getComputedStyle(parent).overflow);
        console.log('Contenedor padre - position:', window.getComputedStyle(parent).position);
    }

    // Verificar si hay algún estilo global que pueda estar ocultando
    console.log('Verificando posibles problemas de CSS...');
    const body = document.body;
    console.log('Body - display:', window.getComputedStyle(body).display);
    console.log('Body - visibility:', window.getComputedStyle(body).visibility);

    // Intentar forzar visibilidad
    console.log('Intentando forzar visibilidad...');
    container.style.display = 'block';
    container.style.visibility = 'visible';
    if (container.children.length > 0) {
        container.children[0].style.display = 'block';
        container.children[0].style.visibility = 'visible';
        console.log('Visibilidad forzada aplicada');
    }
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