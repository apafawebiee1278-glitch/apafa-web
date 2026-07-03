(() => {
  "use strict";

  const TYPE_LABELS = {
    general: "General",
    financiero: "Financiero",
    reunion: "Reunión",
    urgente: "Urgente",
    evento: "Evento"
  };

  function element(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("es-PE", { dateStyle: "long" }).format(date);
  }

  function renderNotification(item) {
    const article = element("article", "surface notification-card p-4");
    const headingRow = element("div", "d-flex flex-wrap justify-content-between gap-2 mb-3");
    const title = element("h2", "h5 fw-bold text-primary-institution mb-0", item.titulo);
    const badge = element(
      "span",
      `notification-badge type-${item.tipo || "general"}`,
      TYPE_LABELS[item.tipo] || "General"
    );
    headingRow.append(title, badge);
    article.appendChild(headingRow);

    const meta = element("p", "small text-muted mb-3");
    const publication = formatDate(item.fecha_publicacion);
    meta.textContent = `Publicado: ${publication || "Sin fecha"} · ${item.organizador || "Comité APAFA"}`;
    article.appendChild(meta);

    const content = element("p", "notification-content mb-0", item.contenido);
    article.appendChild(content);

    if (item.fecha_evento || item.hora_evento || item.lugar_evento) {
      const eventBox = element("div", "notification-event mt-3 p-3");
      const eventTitle = element("h3", "h6 fw-bold mb-2", "Información relacionada");
      eventBox.appendChild(eventTitle);
      const details = [];
      if (item.fecha_evento) details.push(`Fecha: ${formatDate(item.fecha_evento)}`);
      if (item.hora_evento) details.push(`Hora: ${item.hora_evento}`);
      if (item.lugar_evento) details.push(`Lugar: ${item.lugar_evento}`);
      details.forEach((detail) => eventBox.appendChild(element("p", "mb-1", detail)));
      article.appendChild(eventBox);
    }
    return article;
  }

  async function init() {
    const status = document.getElementById("notification-status");
    const list = document.getElementById("notification-list");
    try {
      const data = await ApafaData.loadData("notificaciones");
      const notifications = Array.isArray(data.notificaciones) ? data.notificaciones : [];
      ApafaData.setText("notification-total", notifications.length);
      ApafaData.setText(
        "notification-urgent",
        notifications.filter((item) => item.tipo === "urgente").length
      );
      ApafaData.setText(
        "notification-events",
        notifications.filter((item) => Boolean(item.fecha_evento)).length
      );

      status.classList.add("d-none");
      list.classList.remove("d-none");
      list.replaceChildren();
      if (!notifications.length) {
        list.appendChild(
          element(
            "div",
            "surface loading-box text-muted",
            "No hay notificaciones vigentes."
          )
        );
        return;
      }
      notifications.forEach((item) => list.appendChild(renderNotification(item)));
    } catch (error) {
      status.textContent = "No se pudieron cargar las notificaciones.";
      status.classList.add("text-danger");
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
