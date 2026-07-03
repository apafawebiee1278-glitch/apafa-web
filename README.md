# APAFA Web

Sitio estático público de la APAFA de la I.E. Ex. Mixto “La Molina” 1278.

## Publicación

- `main` contiene únicamente la plantilla y datos vacíos.
- La aplicación de escritorio genera un corte validado con el estado familiar por aula.
- El corte vigente se publica en la rama `gh-pages`, reemplazando el anterior.
- GitHub Pages sirve `gh-pages` desde la raíz.

## Datos nominales permitidos

El archivo `data/estado_aulas.json` solo puede contener:

- nombre del apoderado;
- estado `al_dia`, `parcial` o `pendiente`;
- nivel, grado y sección;
- fecha, año escolar, resumen y contacto institucional de corrección.

No se admiten DNI, teléfonos de familias, estudiantes, montos, identificadores internos,
bases de datos, recibos, respaldos ni adjuntos.

## Desarrollo local

Sirve esta carpeta mediante HTTP; no abras los HTML directamente:

```powershell
python -m http.server 8080
```

Luego abre `http://127.0.0.1:8080/padres.html`.
