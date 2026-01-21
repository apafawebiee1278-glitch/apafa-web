/**
 * APAFA Web - Página de Inicio (Versión Media para Debug)
 * Usa data-loader pero simplificado
 */

console.log('Index-medium.js cargado');

// Función simplificada para cargar datos básicos
async function loadDashboardDataSimple() {
    console.log('Cargando datos con data-loader...');

    try {
        const stats = await ApafaData.loadData('stats');
        console.log('Stats cargados:', stats);

        const resumen = await ApafaData.loadData('resumen_financiero');
        console.log('Resumen cargado:', resumen);

        return { stats, resumen };
    } catch (error) {
        console.error('Error cargando datos:', error);
        throw error;
    }
}

// Función simplificada para mostrar datos
function renderDashboardSimple(data) {
    console.log('Renderizando datos...');

    try {
        const { stats, resumen } = data;

        // Actualizar elementos básicos
        ApafaData.updateText('#socios-apafa-count', stats.socios_apafa || '0');
        ApafaData.updateText('#total-recaudado', ApafaData.formatCurrency(resumen.total_recaudado || 0));

        console.log('Datos renderizados correctamente');
    } catch (error) {
        console.error('Error renderizando:', error);
        throw error;
    }
}

// Inicialización simplificada
async function initDashboardMedium() {
    console.log('Iniciando dashboard medium...');

    try {
        // Mostrar loading simple
        ApafaData.updateText('#socios-apafa-count', 'Cargando...');
        ApafaData.updateText('#total-recaudado', 'Cargando...');

        // Cargar datos
        const data = await loadDashboardDataSimple();

        // Renderizar
        renderDashboardSimple(data);

        console.log('Dashboard medium completado exitosamente');

    } catch (error) {
        console.error('Error en dashboard medium:', error);
        ApafaData.updateText('#socios-apafa-count', 'Error');
        ApafaData.updateText('#total-recaudado', 'Error');
    }
}

// Ejecutar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM listo, iniciando medium...');
    initDashboardMedium();
});

console.log('Index-medium.js configurado');