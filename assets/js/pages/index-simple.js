/**
 * APAFA Web - Página de Inicio (Versión Simplificada para Debug)
 * Versión mínima para diagnosticar problemas
 */

console.log('Index-simple.js cargado');

// Función simple para actualizar elementos
function updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = content;
        console.log(`Actualizado ${selector}: ${content}`);
    } else {
        console.error(`Elemento no encontrado: ${selector}`);
    }
}

async function loadBasicData() {
    console.log('Cargando datos básicos...');

    try {
        // Cargar stats.json
        const response = await fetch('data/stats.json', { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const stats = await response.json();
        console.log('Stats cargados:', stats);

        // Mostrar datos básicos
        updateElement('#socios-apafa-count', stats.socios_apafa || '0');
        updateElement('#total-recaudado', `S/ ${stats.total_padres * 50 || '0'}`); // Cálculo simple

        console.log('Datos básicos mostrados correctamente');

    } catch (error) {
        console.error('Error cargando datos básicos:', error);
        updateElement('#socios-apafa-count', 'Error');
        updateElement('#total-recaudado', 'Error');
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM listo, iniciando carga de datos...');
    loadBasicData();
});

console.log('Index-simple.js configurado');