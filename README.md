# 🌐 APAFA Web - Sitio Estático

Sitio web estático para la Asociación de Padres de Familia (APAFA) de la I.E. Ex. Mixto "La Molina" 1278.

## 🎯 Arquitectura

**Sitio web completamente estático** compatible con GitHub Pages que consume datos JSON generados por la aplicación de escritorio APAFA.

### 📁 Estructura del Proyecto

```
apafa-web/
├── index.html                    # Página principal (dashboard)
├── padres.html                   # Lista de socios APAFA
├── reuniones.html                # Historial de reuniones
├── assets/
│   ├── css/
│   │   └── main.css             # Estilos principales
│   ├── js/
│   │   ├── data-loader.js       # Sistema de carga de datos JSON
│   │   └── pages/
│   │       ├── index.js         # Lógica de la página principal
│   │       ├── padres.js        # Lógica de la página de padres
│   │       └── reuniones.js     # Lógica de la página de reuniones
│   └── lib/
│       └── bootstrap/           # Bootstrap 5 y dependencias
└── data/
    ├── stats.json               # Estadísticas generales
    ├── padres.json              # Lista de padres con estado de pago
    ├── resumen_financiero.json  # Datos financieros
    ├── conceptos_pago.json      # Conceptos de pago disponibles
    └── comite_apafa.json        # Miembros del comité
```

## 🚀 Cómo Funciona

### 1. **Generación de Datos**
- La **aplicación de escritorio APAFA** (Python + PySide6) genera archivos JSON
- Los datos se escriben en la carpeta `data/`
- **Solo la app puede modificar los datos**

### 2. **Visualización Web**
- El sitio web **solo lee** los archivos JSON
- **No requiere backend** ni base de datos
- Compatible con **GitHub Pages** (hosting gratuito)

### 3. **Actualización**
```bash
# En la aplicación APAFA:
# 1. Registrar pagos/reuniones
# 2. Hacer clic en "Publicar Datos Web"
# 3. Los JSON se actualizan automáticamente
# 4. Hacer git commit + push
# 5. GitHub Pages se actualiza solo
```

## 🔒 Seguridad y Privacidad

### ✅ **Datos Protegidos**
- DNI completo → `****1234` (solo últimos 4 dígitos)
- **No se incluyen teléfonos** ni datos sensibles
- Solo información necesaria para público

### ✅ **Arquitectura Segura**
- **Sitio web de solo lectura**
- **No puede modificar datos**
- **No accede a base de datos**
- **Datos filtrados en la app**

## 🛠️ Tecnologías

- **HTML5 + CSS3** puro (sin frameworks complejos)
- **Bootstrap 5** para diseño responsivo
- **JavaScript ES6+** con Fetch API
- **Bootstrap Icons** para iconografía
- **JSON** para intercambio de datos

## 📊 Páginas Disponibles

### 🏠 **Inicio (`index.html`)**
- Estadísticas generales (socios APAFA, recaudación)
- Información de cuotas y contribuciones
- Notificaciones importantes
- Comité APAFA actual
- Próximos eventos

### 👨‍👩‍👧‍👦 **Socios APAFA (`padres.html`)**
- Lista completa de padres
- Estado de contribuciones (completas/pendientes)
- Estadísticas de cumplimiento
- Información de cómo contribuir

### 📅 **Reuniones (`reuniones.html`)**
- Historial de reuniones realizadas
- Estadísticas de asistencia
- Información de próximas reuniones

## 🎨 Diseño

### 🎨 **Colores Institucionales**
- **Verde Militar**: `#196828` (principal)
- **Verde Oscuro**: `#194218` (navegación)
- **Amarillo**: `#FFD700` (acentos)
- **Rojo**: `#B22222` (alertas)

### 📱 **Diseño Responsivo**
- Compatible con móviles, tablets y desktop
- Bootstrap Grid System
- Componentes adaptativos

## 🔧 Desarrollo Local

### Prerrequisitos
- Navegador web moderno
- Editor de código (opcional)

### Ejecución
```bash
# Abrir index.html en el navegador
# O usar un servidor local simple:
python -m http.server 8000
# Luego abrir: http://localhost:8000
```

### Modificación
1. **Editar HTML**: Modificar archivos `.html`
2. **Editar estilos**: `assets/css/main.css`
3. **Editar lógica**: `assets/js/pages/*.js`
4. **Probar cambios**: Abrir en navegador

## 🚀 Despliegue en GitHub Pages

### Preparación
1. Crear repositorio `apafa-web` en GitHub
2. Subir todo el contenido de esta carpeta
3. Configurar GitHub Pages en Settings → Pages
4. Seleccionar branch `main` y carpeta `/` (root)

### Actualización Automática
```bash
# Después de actualizar datos en la app:
git add data/*.json
git commit -m "Actualizar datos APAFA"
git push origin main
# GitHub Pages se actualiza automáticamente
```

## 🔗 Integración con App de Escritorio

### Flujo de Trabajo
1. **App APAFA** registra datos (pagos, reuniones, etc.)
2. **App genera JSON** en `shared/public_data/`
3. **Archivos se copian** a `apafa-web/data/`
4. **Git commit + push** actualiza el sitio
5. **GitHub Pages** refleja cambios automáticamente

### Archivos Sincronizados
- `stats.json` ← `estadisticas.json`
- `padres.json` ← `padres` (filtrado)
- `resumen_financiero.json` ← `resumen_financiero.json`
- `conceptos_pago.json` ← `conceptos_pago.json`
- `comite_apafa.json` ← `comite_apafa.json`

## 🐛 Solución de Problemas

### Web no carga datos
```bash
# Verificar que existen los archivos JSON
ls -la data/*.json

# Verificar contenido JSON
cat data/stats.json
```

### Error de CORS
- Solo funciona desde servidor web (localhost o GitHub Pages)
- No funciona abriendo archivos directamente

### Datos no se actualizan
- Verificar que la app generó los JSON
- Hacer commit y push de los cambios
- Esperar 1-2 minutos para que GitHub Pages actualice

## 📝 Notas de Desarrollo

- **Principio de responsabilidad única**: Cada archivo JS maneja una página
- **Separación de concerns**: HTML (estructura), CSS (estilos), JS (lógica)
- **Fallbacks robustos**: Funciona incluso si faltan datos
- **Performance**: Carga lazy de datos JSON

## 🎉 Éxito del Proyecto

✅ **Sitio web estático** funcional
✅ **Compatible con GitHub Pages**
✅ **Integración perfecta** con app de escritorio
✅ **Seguro y privado**
✅ **Fácil de mantener**
✅ **Hosting gratuito**

**La web muestra, la app manda. 🎯**