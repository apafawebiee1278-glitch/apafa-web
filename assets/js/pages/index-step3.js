/**
 * APAFA Web - Página de Inicio (Step 3: Agregar renderComiteApafa)
 * Esta debería ser la función problemática
 */

console.log('Index-step3.js cargado');

async function loadDashboardData() {
    console.log('Cargando datos del dashboard...');

    try {
        const [stats, resumenFinanciero, conceptosPago, comiteApafa] = await Promise.all([
            ApafaData.loadData('stats'),
            ApafaData.loadData('resumen_financiero'),
            ApafaData.loadData('conceptos_pago'),
            ApafaData.loadData('comite_apafa')
        ]);

        console.log('Datos cargados:', { stats, resumenFinanciero, conceptosPago, comiteApafa });
        return { stats, resumenFinanciero, conceptosPago, comiteApafa };
    } catch (error) {
        console.error('Error cargando datos:', error);
        throw error;
    }
}

// Funciones ya probadas que funcionan
function renderEstadisticasRapidas(data) {
    console.log('Renderizando estadísticas rápidas...');
    const { stats, resumenFinanciero } = data;
    ApafaData.updateText('#socios-apafa-count', stats.socios_apafa || 0);
    ApafaData.updateText('#total-recaudado', ApafaData.formatCurrency(resumenFinanciero.total_recaudado || 0));
}

function renderCuotas(data) {
    console.log('Renderizando cuotas...');
    const { conceptosPago } = data;

    if (!conceptosPago.conceptos || conceptosPago.conceptos.length === 0) {
        ApafaData.updateElement('#cuota-obligatoria', `
            <strong>Cuota APAFA 2026-2027:</strong><br>
            <span class="h4 text-accent-institution">S/ 150.00</span>
        `);
        return;
    }

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

function renderContribucionesAdicionales(data) {
    console.log('Renderizando contribuciones adicionales...');
    const { conceptosPago } = data;

    if (!conceptosPago.conceptos || conceptosPago.conceptos.length === 0) {
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

// AGREGAR renderComiteApafa (esta debería ser la problemática)
function renderComiteApafa(data) {
    console.log('Renderizando comité APAFA...');

    try {
        const { comiteApafa } = data;

        // Verificar que existe el comité
        if (!comiteApafa) {
            console.log('No hay datos de comité');
            ApafaData.updateElement('#comite-directivos', '<li class="text-muted">No hay datos disponibles</li>');
            ApafaData.updateElement('#comite-vocales', '');
            return;
        }

        console.log('Procesando directivos...');
        // Renderizar directivos
        let directivosHtml = '';
        if (comiteApafa.directivos && comiteApafa.directivos.length > 0) {
            comiteApafa.directivos.forEach(directivo => {
                directivosHtml += `<li class="mb-2"><i class="bi bi-person-circle me-2 text-primary-institution"></i><strong>${directivo.cargo}:</strong> ${directivo.nombre_completo}</li>`;
            });
        } else {
            directivosHtml = '<li class="text-muted">No hay directivos definidos</li>';
        }
        ApafaData.updateElement('#comite-directivos', directivosHtml);

        console.log('Procesando vocales...');
        // Renderizar vocales
        let vocalesHtml = '';
        if (comiteApafa.vocales && comiteApafa.vocales.length > 0) {
            comiteApafa.vocales.forEach(vocal => {
                vocalesHtml += `<li class="mb-2"><i class="bi bi-person-circle me-2 text-accent-institution"></i><strong>${vocal.cargo}:</strong> ${vocal.nombre_completo}</li>`;
            });

            // Agregar colaboradores si existen
            if (comiteApafa.colaboradores && comiteApafa.colaboradores.length > 0) {
                vocalesHtml += '<h6 class="text-accent-institution mb-3 mt-4">Colaboradores</h6><ul class="list-unstyled">';
                comiteApafa.colaboradores.forEach(colaborador => {
                    vocalesHtml += `<li class="mb-2"><i class="bi bi-person-circle me-2 text-secondary-institution"></i>${colaborador.nombre_completo}</li>`;
                });
                vocalesHtml += '</ul>';
            }
        } else {
            vocalesHtml = '<li class="text-muted">No hay vocales definidos</li>';
        }
        ApafaData.updateElement('#comite-vocales', vocalesHtml);

        console.log('Comité APAFA renderizado correctamente');

    } catch (error) {
        console.error('Error en renderComiteApafa:', error);
        throw error;
    }
}

async function renderDashboard(data) {
    console.log('Renderizando dashboard completo...');

    try {
        renderEstadisticasRapidas(data);
        renderCuotas(data);
        renderContribucionesAdicionales(data);
        renderComiteApafa(data);  // <- Esta es la nueva función que debería fallar

        console.log('Dashboard renderizado completamente');
    } catch (error) {
        console.error('Error renderizando dashboard:', error);
        throw error;
    }
}

async function initDashboard() {
    console.log('Iniciando dashboard step 3...');

    try {
        const data = await loadDashboardData();
        console.log('Datos obtenidos, renderizando...');

        await renderDashboard(data);
        console.log('Renderizado completado');

        // Limpiar cualquier loading restante
        const mainContent = document.querySelector('#main-content');
        if (mainContent && mainContent.innerHTML.includes('Cargando')) {
            mainContent.innerHTML = '';
        }

        console.log('Dashboard step 3 completado exitosamente');

    } catch (error) {
        console.error('Error en initDashboard:', error);

        // Mostrar error detallado
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.innerHTML = `
            <strong>Error en Step 3:</strong><br>
            <small>${error.message}</small><br>
            <small><em>Revisa la consola del navegador para más detalles</em></small>
        `;
        document.querySelector('.container').appendChild(errorDiv);
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);
console.log('Index-step3.js configurado');