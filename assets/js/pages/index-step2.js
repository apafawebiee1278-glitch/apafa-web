/**
 * APAFA Web - Página de Inicio (Step 2: Agregar renderContribucionesAdicionales)
 */

console.log('Index-step2.js cargado');

async function loadDashboardData() {
    console.log('Cargando datos del dashboard...');

    try {
        const [stats, resumenFinanciero, conceptosPago] = await Promise.all([
            ApafaData.loadData('stats'),
            ApafaData.loadData('resumen_financiero'),
            ApafaData.loadData('conceptos_pago')
        ]);

        console.log('Datos cargados:', { stats, resumenFinanciero, conceptosPago });
        return { stats, resumenFinanciero, conceptosPago };
    } catch (error) {
        console.error('Error cargando datos:', error);
        throw error;
    }
}

// Copia simplificada de renderEstadisticasRapidas
function renderEstadisticasRapidas(data) {
    console.log('Renderizando estadísticas rápidas...');

    try {
        const { stats, resumenFinanciero } = data;

        ApafaData.updateText('#socios-apafa-count', stats.socios_apafa || 0);
        ApafaData.updateText('#total-recaudado', ApafaData.formatCurrency(resumenFinanciero.total_recaudado || 0));

        console.log('Estadísticas rápidas renderizadas');
    } catch (error) {
        console.error('Error en renderEstadisticasRapidas:', error);
        throw error;
    }
}

// renderCuotas (ya probado que funciona)
function renderCuotas(data) {
    console.log('Renderizando cuotas...');

    try {
        const { conceptosPago } = data;

        if (!conceptosPago.conceptos || conceptosPago.conceptos.length === 0) {
            ApafaData.updateElement('#cuota-obligatoria', `
                <strong>Cuota APAFA 2026-2027:</strong><br>
                <span class="h4 text-accent-institution">S/ 150.00</span>
            `);
            console.log('Cuotas: datos vacíos, usando fallback');
            return;
        }

        const cuotaObligatoria = conceptosPago.conceptos.find(c => c.obligatorio && c.nombre.toLowerCase().includes('apafa'));

        if (cuotaObligatoria) {
            ApafaData.updateElement('#cuota-obligatoria', `
                <strong>${cuotaObligatoria.nombre}:</strong><br>
                <span class="h4 text-accent-institution">${ApafaData.formatCurrency(cuotaObligatoria.monto_limite)}</span>
            `);
            console.log('Cuotas: encontrada cuota obligatoria');
        } else {
            ApafaData.updateElement('#cuota-obligatoria', `
                <strong>Cuota APAFA 2026-2027:</strong><br>
                <span class="h4 text-accent-institution">S/ 150.00</span>
            `);
            console.log('Cuotas: no encontrada cuota obligatoria, usando fallback');
        }
    } catch (error) {
        console.error('Error en renderCuotas:', error);
        throw error;
    }
}

// Agregar renderContribucionesAdicionales (esta podría ser la problemática)
function renderContribucionesAdicionales(data) {
    console.log('Renderizando contribuciones adicionales...');

    try {
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
            console.log('Contribuciones: datos vacíos, usando fallback');
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
            console.log('Contribuciones: no hay opcionales');
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
        console.log('Contribuciones adicionales renderizadas');

    } catch (error) {
        console.error('Error en renderContribucionesAdicionales:', error);
        throw error;
    }
}

async function renderDashboard(data) {
    console.log('Renderizando dashboard completo...');

    try {
        renderEstadisticasRapidas(data);
        renderCuotas(data);  // Ya probado que funciona
        renderContribucionesAdicionales(data);  // <- Esta es la nueva función que podría fallar

        console.log('Dashboard renderizado completamente');
    } catch (error) {
        console.error('Error renderizando dashboard:', error);
        throw error;
    }
}

async function initDashboard() {
    console.log('Iniciando dashboard step 2...');

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

        console.log('Dashboard step 2 completado exitosamente');

    } catch (error) {
        console.error('Error en initDashboard:', error);

        // Mostrar error en un lugar visible
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.innerHTML = `<strong>Error en Step 2:</strong> ${error.message}`;
        document.querySelector('.container').appendChild(errorDiv);
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);
console.log('Index-step2.js configurado');