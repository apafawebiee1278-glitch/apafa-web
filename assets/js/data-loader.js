(() => {
  "use strict";

  const cache = new Map();
  const dataRoot = new URL("data/", document.baseURI);

  async function loadData(filename, useCache = true) {
    if (useCache && cache.has(filename)) {
      return cache.get(filename);
    }

    const url = new URL(`${filename}.json`, dataRoot);
    url.searchParams.set("t", Date.now().toString());
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${filename} (${response.status})`);
    }
    const data = await response.json();
    if (useCache) {
      cache.set(filename, data);
    }
    return data;
  }

  async function loadDataWithFallback(filename, fallback) {
    try {
      return await loadData(filename);
    } catch (error) {
      console.warn(`Usando datos vacíos para ${filename}:`, error.message);
      return fallback;
    }
  }

  function formatDate(value) {
    if (!value) return "Sin fecha";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "long",
      timeStyle: "short"
    }).format(date);
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value ?? "");
  }

  window.ApafaData = { loadData, loadDataWithFallback, formatDate, setText };
})();
