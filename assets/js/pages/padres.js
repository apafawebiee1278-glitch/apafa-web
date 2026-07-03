(() => {
  "use strict";

  let publicData = null;
  let selectedClassroom = null;

  const stateLabels = {
    al_dia: "Al día",
    parcial: "Pago parcial",
    pendiente: "Pendiente"
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function fillSelect(select, values, preferred) {
    const previous = preferred || select.value;
    select.replaceChildren();
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
    if (values.includes(previous)) select.value = previous;
  }

  function classroomsFor(level, grade) {
    return (publicData?.aulas || []).filter(
      (classroom) =>
        (!level || classroom.nivel === level) &&
        (!grade || classroom.grado === grade)
    );
  }

  function updateFilters(preferred = {}) {
    const levelSelect = document.getElementById("filter-level");
    const gradeSelect = document.getElementById("filter-grade");
    const sectionSelect = document.getElementById("filter-section");
    const classrooms = publicData?.aulas || [];

    fillSelect(
      levelSelect,
      unique(classrooms.map((classroom) => classroom.nivel)),
      preferred.nivel
    );
    const byLevel = classroomsFor(levelSelect.value);
    fillSelect(
      gradeSelect,
      unique(byLevel.map((classroom) => classroom.grado)),
      preferred.grado
    );
    const byGrade = classroomsFor(levelSelect.value, gradeSelect.value);
    fillSelect(
      sectionSelect,
      unique(byGrade.map((classroom) => classroom.seccion)),
      preferred.seccion
    );
    selectCurrentClassroom();
  }

  function selectCurrentClassroom() {
    const level = document.getElementById("filter-level").value;
    const grade = document.getElementById("filter-grade").value;
    const section = document.getElementById("filter-section").value;
    selectedClassroom = (publicData?.aulas || []).find(
      (classroom) =>
        classroom.nivel === level &&
        classroom.grado === grade &&
        classroom.seccion === section
    );
    renderClassroom();
  }

  function renderFamilyList(containerId, state, query) {
    const container = document.getElementById(containerId);
    container.replaceChildren();
    const families = (selectedClassroom?.familias || []).filter(
      (family) =>
        family.estado === state &&
        family.nombre.toLocaleLowerCase("es-PE").includes(query)
    );
    if (!families.length) {
      container.appendChild(
        element("li", "status-empty", "No hay familias en este estado.")
      );
      return;
    }
    families.forEach((family) => {
      const item = element("li", "status-person");
      item.appendChild(element("span", "person-dot", "•"));
      item.appendChild(element("span", "", family.nombre));
      container.appendChild(item);
    });
  }

  function renderClassroom() {
    if (!selectedClassroom) return;
    const query = document
      .getElementById("filter-name")
      .value.trim()
      .toLocaleLowerCase("es-PE");
    const totals = selectedClassroom.totales || {};

    ApafaData.setText(
      "classroom-title",
      `${selectedClassroom.nivel} ${selectedClassroom.grado} ${selectedClassroom.seccion}`
    );
    ApafaData.setText("classroom-total", totals.familias || 0);
    ApafaData.setText("classroom-paid", totals.al_dia || 0);
    ApafaData.setText("classroom-partial", totals.parcial || 0);
    ApafaData.setText("classroom-pending", totals.pendiente || 0);
    ApafaData.setText("paid-count", totals.al_dia || 0);
    ApafaData.setText("partial-count", totals.parcial || 0);
    ApafaData.setText("pending-count", totals.pendiente || 0);

    renderFamilyList("paid-list", "al_dia", query);
    renderFamilyList("partial-list", "parcial", query);
    renderFamilyList("pending-list", "pendiente", query);

    const params = new URLSearchParams();
    params.set("aula", selectedClassroom.slug);
    history.replaceState(null, "", `#${params.toString()}`);
  }

  async function copyClassroomLink() {
    const button = document.getElementById("copy-link");
    try {
      await navigator.clipboard.writeText(window.location.href);
      button.textContent = "Enlace copiado";
    } catch {
      button.textContent = "Copia la dirección del navegador";
    }
    window.setTimeout(() => {
      button.textContent = "Copiar enlace del aula";
    }, 2200);
  }

  async function init() {
    const loading = document.getElementById("loading-state");
    const content = document.getElementById("classroom-content");
    const error = document.getElementById("error-state");
    try {
      publicData = await ApafaData.loadData("estado_aulas");
      if (!Array.isArray(publicData.aulas) || !publicData.aulas.length) {
        throw new Error("No existe un corte de aulas publicado.");
      }

      ApafaData.setText("institution-name", publicData.institucion || "APAFA");
      ApafaData.setText("school-year", publicData.anio_escolar || "");
      ApafaData.setText("last-update", ApafaData.formatDate(publicData.publicado_en));
      const summary = publicData.resumen || {};
      ApafaData.setText("summary-classrooms", summary.aulas || 0);
      ApafaData.setText("summary-families", summary.familias || 0);
      ApafaData.setText("summary-paid", summary.al_dia || 0);
      ApafaData.setText("summary-partial", summary.parcial || 0);
      ApafaData.setText("summary-pending", summary.pendiente || 0);

      const hash = new URLSearchParams(window.location.hash.slice(1));
      const requested = (publicData.aulas || []).find(
        (classroom) => classroom.slug === hash.get("aula")
      );
      updateFilters(requested || {});

      document.getElementById("filter-level").addEventListener("change", () => {
        updateFilters({ nivel: document.getElementById("filter-level").value });
      });
      document.getElementById("filter-grade").addEventListener("change", () => {
        const level = document.getElementById("filter-level").value;
        updateFilters({
          nivel: level,
          grado: document.getElementById("filter-grade").value
        });
      });
      document
        .getElementById("filter-section")
        .addEventListener("change", selectCurrentClassroom);
      document
        .getElementById("filter-name")
        .addEventListener("input", renderClassroom);
      document.getElementById("copy-link").addEventListener("click", copyClassroomLink);

      loading.hidden = true;
      content.hidden = false;
    } catch (loadError) {
      loading.hidden = true;
      error.hidden = false;
      error.querySelector("p").textContent =
        loadError.message || "No se pudo cargar el corte vigente.";
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
