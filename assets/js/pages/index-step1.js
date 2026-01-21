/**
 * APAFA Web - Página de Inicio (Step 1: Agregar renderCuotas)
 */

console.log('Index-step1.js cargado');

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

// Agregar renderCuotas (esta podría ser la problemática)
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

async function renderDashboard(data) {
    console.log('Renderizando dashboard completo...');

    try {
        renderEstadisticasRapidas(data);
        renderCuotas(data);  // <- Esta es la nueva función que podría fallar

        console.log('Dashboard renderizado completamente');
    } catch (error) {
        console.error('Error renderizando dashboard:', error);
        throw error;
    }
}

async function initDashboard() {
    console.log('Iniciando dashboard step 1...');

    try {
        ApafaData.showLoading('#main-content', 'Cargando datos...');

        const data = await loadDashboardData();
        await renderDashboard(data);

        ApafaData.toggleElement('.loading-spinner', false);
        console.log('Dashboard step 1 completado');

    } catch (error) {
        console.error('Error en initDashboard:', error);
        ApafaData.showError('#main-content', 'Error al cargar el dashboard');
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);
console.log('Index-step1.js configurado');