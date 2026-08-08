(() => {
  "use strict";

  async function init() {
    const status = document.getElementById("data-status");
    try {
      const data = await ApafaData.loadData("estado_aulas");
      const summary = data.resumen || {};
      ApafaData.setText("institution-name", data.institucion || "APAFA");
      ApafaData.setText("school-year", data.anio_escolar || "");
      ApafaData.setText("summary-classrooms", summary.aulas || 0);
      ApafaData.setText("summary-families", summary.familias || 0);
      ApafaData.setText("summary-paid", summary.al_dia || 0);
      ApafaData.setText("summary-partial", summary.parcial || 0);
      ApafaData.setText("summary-pending", summary.pendiente || 0);
      ApafaData.setText("last-update", ApafaData.formatDate(data.publicado_en));
      status.textContent = "Información vigente cargada correctamente.";
      status.className = "small text-success";
    } catch (error) {
      status.textContent =
        "Todavía no hay un corte vigente. Tesorería publicará la información después de validarla.";
      status.className = "small text-muted";
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
