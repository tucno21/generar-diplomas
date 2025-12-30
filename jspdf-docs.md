# Documentación de jsPDF

## Tabla de Contenidos
- [Introducción](#introducción)
- [Instalación](#instalación)
- [Uso Básico](#uso-básico)
- [Configuración Inicial](#configuración-inicial)
- [Métodos Principales](#métodos-principales)
- [Características Avanzadas](#características-avanzadas)
- [Soporte de Fuentes UTF-8](#soporte-de-fuentes-utf-8)
- [Módulos y Plugins](#módulos-y-plugins)
- [Ejemplos](#ejemplos)

## Introducción

jsPDF es una biblioteca de JavaScript para generar documentos PDF en el navegador y en Node.js. Es una herramienta poderosa que permite crear PDFs dinámicamente sin necesidad de procesamiento del lado del servidor.

### Características principales
- Generación de PDFs completamente del lado del cliente
- Soporte para múltiples formatos de página y orientaciones
- Soporte para imágenes (JPEG, PNG, GIF, WebP, BMP, SVG)
- Renderizado de HTML a PDF
- Fuentes personalizadas con soporte TTF
- Formularios interactivos (AcroForms)
- Soporte para Canvas y Context2D
- Anotaciones y enlaces

## Instalación

### NPM/Yarn
```bash
npm install jspdf --save
# o
yarn add jspdf
```

### CDN
```html
<!-- Versión específica -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.4/jspdf.umd.min.js"></script>

<!-- Última versión -->
<script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
```

### Tipos de archivos en la carpeta dist
- **jspdf.es.*.js**: Formato de módulo ES2015 moderno
- **jspdf.node.*.js**: Para ejecutar en Node.js
- **jspdf.umd.*.js**: Formato UMD para AMD o carga via script tag
- **polyfills*.js**: Polyfills requeridos para navegadores antiguos

## Uso Básico

### ES6 Modules
```javascript
import { jsPDF } from "jspdf";

// Documento A4 por defecto, vertical, unidades en milímetros
const doc = new jsPDF();

doc.text("¡Hola mundo!", 10, 10);
doc.save("documento.pdf");
```

### Node.js
```javascript
const { jsPDF } = require("jspdf");

const doc = new jsPDF();
doc.text("¡Hola mundo!", 10, 10);
doc.save("documento.pdf"); // Guarda en el directorio actual
```

### AMD
```javascript
require(["jspdf"], ({ jsPDF }) => {
  const doc = new jsPDF();
  doc.text("¡Hola mundo!", 10, 10);
  doc.save("documento.pdf");
});
```

### Carga Global
```javascript
const { jsPDF } = window.jspdf;

const doc = new jsPDF();
doc.text("¡Hola mundo!", 10, 10);
doc.save("documento.pdf");
```

## Configuración Inicial

### Opciones del Constructor

```javascript
const doc = new jsPDF({
  orientation: "landscape", // "portrait" o "landscape"
  unit: "in",              // "pt", "mm", "cm", "in"
  format: [4, 2]           // [ancho, alto] o "a4", "letter", etc.
});
```

#### Orientaciones disponibles
- `"portrait"` (vertical) - por defecto
- `"landscape"` (horizontal)

#### Unidades disponibles
- `"pt"` - puntos
- `"mm"` - milímetros (por defecto)
- `"cm"` - centímetros
- `"in"` - pulgadas

#### Formatos predefinidos
- `"a0"`, `"a1"`, `"a2"`, `"a3"`, `"a4"` (por defecto), `"a5"`, `"a6"`, `"a7"`, `"a8"`, `"a9"`, `"a10"`
- `"letter"`, `"legal"`, `"tabloid"`
- Array `[ancho, alto]` para tamaños personalizados

## Métodos Principales

### Texto

#### `text(text, x, y, options)`
Añade texto al documento.

```javascript
doc.text("Texto simple", 10, 10);

// Con opciones
doc.text("Texto con opciones", 10, 20, {
  align: "center",
  angle: 45,
  baseline: "middle"
});

// Texto multilínea
doc.text(["Línea 1", "Línea 2", "Línea 3"], 10, 30);
```

**Opciones:**
- `align`: `"left"`, `"center"`, `"right"`, `"justify"`
- `angle`: rotación en grados
- `baseline`: `"top"`, `"middle"`, `"bottom"`, `"alphabetic"`, `"hanging"`
- `maxWidth`: ancho máximo para ajuste automático

#### `setFont(fontName, fontStyle)`
Establece la fuente actual.

```javascript
doc.setFont("helvetica", "normal");
doc.setFont("times", "italic");
doc.setFont("courier", "bold");
```

#### `setFontSize(size)`
Establece el tamaño de fuente.

```javascript
doc.setFontSize(16);
doc.text("Texto grande", 10, 10);
```

#### `setTextColor(r, g, b)` o `setTextColor(grayLevel)` o `setTextColor(colorString)`
Establece el color del texto.

```javascript
doc.setTextColor(255, 0, 0); // Rojo
doc.setTextColor(128);        // Gris
doc.setTextColor("#FF0000");  // Rojo hexadecimal
```

### Formas y Dibujo

#### `line(x1, y1, x2, y2)`
Dibuja una línea.

```javascript
doc.line(10, 10, 100, 10);
```

#### `rect(x, y, width, height, style)`
Dibuja un rectángulo.

```javascript
doc.rect(10, 10, 50, 30);           // Solo contorno
doc.rect(10, 50, 50, 30, "F");      // Relleno
doc.rect(10, 90, 50, 30, "FD");     // Relleno y contorno
```

**Estilos:**
- `"S"` o `null`: solo contorno (por defecto)
- `"F"`: solo relleno
- `"FD"` o `"DF"`: relleno y contorno

#### `roundedRect(x, y, width, height, radiusX, radiusY, style)`
Dibuja un rectángulo con esquinas redondeadas.

```javascript
doc.roundedRect(10, 10, 50, 30, 5, 5, "FD");
```

#### `circle(x, y, radius, style)`
Dibuja un círculo.

```javascript
doc.circle(50, 50, 20);
doc.circle(50, 100, 20, "F");
```

#### `ellipse(x, y, radiusX, radiusY, style)`
Dibuja una elipse.

```javascript
doc.ellipse(50, 50, 30, 20);
doc.ellipse(50, 100, 30, 20, "FD");
```

#### `triangle(x1, y1, x2, y2, x3, y3, style)`
Dibuja un triángulo.

```javascript
doc.triangle(50, 10, 10, 50, 90, 50, "FD");
```

### Colores

#### `setDrawColor(r, g, b)` o `setDrawColor(grayLevel)` o `setDrawColor(colorString)`
Color del contorno.

```javascript
doc.setDrawColor(0, 0, 255); // Azul
```

#### `setFillColor(r, g, b)` o `setFillColor(grayLevel)` o `setFillColor(colorString)`
Color de relleno.

```javascript
doc.setFillColor(0, 255, 0); // Verde
```

### Líneas

#### `setLineWidth(width)`
Establece el grosor de línea.

```javascript
doc.setLineWidth(2);
```

#### `setLineCap(style)`
Establece el estilo de los extremos de línea.

```javascript
doc.setLineCap("round"); // "butt", "round", "square"
```

#### `setLineJoin(style)`
Establece el estilo de las uniones de línea.

```javascript
doc.setLineJoin("round"); // "miter", "round", "bevel"
```

#### `setLineDashPattern(pattern, phase)`
Establece el patrón de línea discontinua.

```javascript
doc.setLineDashPattern([5, 5], 0); // Línea punteada
doc.setLineDashPattern([10, 5], 0); // Guiones largos
doc.setLineDashPattern([], 0);      // Línea continua
```

### Páginas

#### `addPage(format, orientation)`
Añade una nueva página.

```javascript
doc.addPage();
doc.addPage("a4", "landscape");
doc.addPage([200, 200]);
```

#### `deletePage(pageNumber)`
Elimina una página específica.

```javascript
doc.deletePage(2);
```

#### `insertPage(beforePage, format, orientation)`
Inserta una página antes de la página especificada.

```javascript
doc.insertPage(2);
doc.insertPage(2, "a4", "portrait");
```

#### `setPage(pageNumber)`
Establece la página activa actual.

```javascript
doc.setPage(1);
```

#### `movePage(targetPage, beforePage)`
Mueve una página a otra posición.

```javascript
doc.movePage(3, 1); // Mueve la página 3 antes de la página 1
```

### Imágenes

#### `addImage(imageData, format, x, y, width, height, alias, compression, rotation)`
Añade una imagen al PDF.

```javascript
// Desde URL de datos
doc.addImage(imageData, "PNG", 15, 40, 180, 160);

// Desde elemento de imagen
const img = document.getElementById("mi-imagen");
doc.addImage(img, "PNG", 15, 40, 180, 160);

// Con rotación
doc.addImage(imageData, "JPEG", 15, 40, 180, 160, "", "FAST", 90);
```

**Formatos soportados:**
- `"PNG"`
- `"JPEG"` / `"JPG"`
- `"GIF"`
- `"WEBP"`
- `"BMP"`

**Opciones de compresión:**
- `"NONE"` - sin compresión
- `"FAST"` - compresión rápida
- `"MEDIUM"` - compresión media
- `"SLOW"` - compresión lenta (mejor calidad)

### Propiedades del Documento

#### `setDocumentProperties(properties)`
Establece las propiedades del documento.

```javascript
doc.setDocumentProperties({
  title: "Mi Documento",
  subject: "Tema del documento",
  author: "Nombre del Autor",
  keywords: "pdf, generación, javascript",
  creator: "Mi Aplicación"
});
```

### Guardar y Exportar

#### `save(filename, options)`
Guarda el PDF con el nombre especificado.

```javascript
doc.save("documento.pdf");
```

#### `output(type, options)`
Genera la salida del PDF en diferentes formatos.

```javascript
// Como string
const pdfString = doc.output("datauristring");

// Como blob
const blob = doc.output("blob");

// Como array buffer
const arrayBuffer = doc.output("arraybuffer");

// Como data URI
const dataUri = doc.output("dataurlstring");

// Abrir en nueva ventana
doc.output("dataurlnewwindow");
```

**Tipos de salida:**
- `"datauristring"` / `"dataurlstring"`: Data URI string
- `"datauri"` / `"dataurl"`: Abre en nueva ventana
- `"dataurlnewwindow"`: Abre en nueva ventana
- `"blob"`: Blob
- `"arraybuffer"`: ArrayBuffer
- `"bloburi"` / `"bloburl"`: Blob URL

## Características Avanzadas

### Modos de API

jsPDF tiene dos modos de API:

#### Modo Compatible (por defecto)
Compatible con plugins originales pero sin características avanzadas.

```javascript
doc.compatAPI(doc => {
  // Tu código aquí
});
```

#### Modo Avanzado
Acceso completo a características avanzadas como matrices de transformación, patrones y FormObjects.

```javascript
doc.advancedAPI(doc => {
  // Tu código con características avanzadas
  doc.setCurrentTransformationMatrix(matrix);
});
```

### Transformaciones

#### `setCurrentTransformationMatrix(matrix)`
Establece la matriz de transformación actual.

```javascript
const matrix = new Matrix(1, 0, 0, 1, 0, 0);
doc.setCurrentTransformationMatrix(matrix);
```

### Estados Gráficos

#### `saveGraphicsState()`
Guarda el estado gráfico actual.

```javascript
doc.saveGraphicsState();
```

#### `restoreGraphicsState()`
Restaura el estado gráfico previamente guardado.

```javascript
doc.saveGraphicsState();
doc.setFillColor(255, 0, 0);
doc.circle(50, 50, 20, "F");
doc.restoreGraphicsState(); // Restaura el color anterior
```

#### `setGState(gState)`
Establece un estado gráfico (GState).

```javascript
const gState = new GState({
  opacity: 0.5,
  "stroke-opacity": 0.7
});
doc.setGState(gState);
```

### Patrones

#### `addPattern(key, pattern)`
Añade un patrón de sombreado o mosaico.

```javascript
// Patrón de mosaico
const pattern = new TilingPattern(...);
doc.addPattern("mi-patron", pattern);
```

### Objetos de Formulario

#### `beginFormObject(x, y, width, height, matrix)`
Inicia un objeto de formulario.

```javascript
doc.beginFormObject(0, 0, 100, 100);
doc.circle(50, 50, 40, "FD");
const formObj = doc.endFormObject("mi-forma");
```

#### `doFormObject(key)`
Renderiza un objeto de formulario previamente creado.

```javascript
doc.doFormObject("mi-forma");
```

## Soporte de Fuentes UTF-8

Las 14 fuentes estándar en PDF están limitadas a ASCII. Para usar UTF-8, debes integrar una fuente personalizada TTF.

### Conversión de fuentes

1. Visita el convertidor: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
2. Sube tu archivo .ttf
3. Descarga el archivo .js generado
4. Incluye el archivo en tu proyecto

### Uso de fuentes personalizadas

```javascript
import { jsPDF } from "jspdf";

// Importa el archivo de fuente generado
import "./fonts/MiFuente.js";

const doc = new jsPDF();

doc.setFont("MiFuente");
doc.text("Texto con caracteres UTF-8: 你好世界", 10, 10);
doc.save("utf8-ejemplo.pdf");
```

### Carga dinámica de fuentes

```javascript
const doc = new jsPDF();

// Cargar archivo TTF como string binario
const fontData = ... // contenido del archivo .ttf como string binario

// Añadir fuente a jsPDF
doc.addFileToVFS("MiFuente.ttf", fontData);
doc.addFont("MiFuente.ttf", "MiFuente", "normal");
doc.setFont("MiFuente");

doc.text("Texto personalizado", 10, 10);
```

## Módulos y Plugins

### HTML

Convierte HTML a PDF.

```javascript
import { jsPDF } from "jspdf";

const doc = new jsPDF();

// Desde elemento HTML
const element = document.getElementById("contenido");
doc.html(element, {
  callback: function(doc) {
    doc.save("desde-html.pdf");
  },
  x: 10,
  y: 10
});

// Desde string HTML
doc.html("<h1>Título</h1><p>Párrafo</p>", {
  callback: function(doc) {
    doc.save("desde-string.pdf");
  }
});
```

**Dependencias opcionales:**
- `html2canvas` (requerido)
- `dompurify` (requerido para strings HTML)

### Autotable

Plugin para crear tablas (requiere instalación adicional).

```javascript
import "jspdf-autotable";

const doc = new jsPDF();

doc.autoTable({
  head: [["Nombre", "Email", "País"]],
  body: [
    ["David", "david@example.com", "Suecia"],
    ["Castille", "castille@example.com", "España"]
  ]
});

doc.save("tabla.pdf");
```

### Canvas

Interfaz compatible con Canvas HTML5.

```javascript
const doc = new jsPDF();
const ctx = doc.canvas.getContext("2d");

ctx.fillStyle = "blue";
ctx.fillRect(10, 10, 50, 50);

doc.save("canvas.pdf");
```

### SVG

Añade imágenes SVG al PDF.

```javascript
const svgElement = document.getElementById("mi-svg");
doc.addSvgAsImage(svgElement, 10, 10, 100, 100);
```

### AcroForms

Crea formularios interactivos en PDF.

```javascript
// Campo de texto
const textField = new AcroFormTextField();
textField.fieldName = "nombre";
textField.value = "Valor inicial";
textField.Rect = [10, 10, 150, 30];
doc.addField(textField);

// Casilla de verificación
const checkbox = new AcroFormCheckBox();
checkbox.fieldName = "acepto";
checkbox.Rect = [10, 50, 20, 20];
doc.addField(checkbox);

// Botón
const button = new AcroFormPushButton();
button.fieldName = "enviar";
button.caption = "Enviar";
button.Rect = [10, 80, 60, 30];
doc.addField(button);
```

### Anotaciones

Añade enlaces y otras anotaciones.

```javascript
// Enlace web
doc.textWithLink("Visita nuestro sitio", 10, 10, {
  url: "https://ejemplo.com"
});

// Enlace interno
doc.link(10, 10, 50, 10, { pageNumber: 2 });

// Anotación de texto
doc.createAnnotation({
  type: "text",
  title: "Nota",
  contents: "Este es un comentario",
  bounds: { x: 10, y: 10, w: 50, h: 50 }
});
```

## Ejemplos

### Documento simple con formato

```javascript
const doc = new jsPDF();

// Título
doc.setFontSize(20);
doc.setFont("helvetica", "bold");
doc.text("Mi Documento", 105, 20, { align: "center" });

// Subtítulo
doc.setFontSize(14);
doc.setFont("helvetica", "normal");
doc.text("Un ejemplo completo", 105, 30, { align: "center" });

// Contenido
doc.setFontSize(12);
doc.text("Este es un párrafo de ejemplo.", 20, 50);
doc.text("Aquí puedes agregar más contenido.", 20, 60);

// Forma decorativa
doc.setDrawColor(0, 0, 255);
doc.setLineWidth(2);
doc.rect(15, 15, 180, 267);

doc.save("documento-formateado.pdf");
```

### Documento con múltiples páginas

```javascript
const doc = new jsPDF();

// Página 1
doc.text("Página 1", 20, 20);
doc.setFontSize(12);
doc.text("Contenido de la primera página", 20, 30);

// Página 2
doc.addPage();
doc.text("Página 2", 20, 20);
doc.text("Contenido de la segunda página", 20, 30);

// Página 3 (horizontal)
doc.addPage("a4", "landscape");
doc.text("Página 3 - Horizontal", 20, 20);

doc.save("multi-pagina.pdf");
```

### Informe con gráficos

```javascript
const doc = new jsPDF();

// Título del informe
doc.setFontSize(18);
doc.text("Informe Mensual", 105, 20, { align: "center" });

// Datos
doc.setFontSize(12);
doc.text("Ventas: $10,000", 20, 40);
doc.text("Gastos: $6,000", 20, 50);
doc.text("Ganancia: $4,000", 20, 60);

// Gráfico de barras simple
doc.setFillColor(0, 128, 255);
doc.rect(20, 80, 80, 20, "F");
doc.setFillColor(255, 128, 0);
doc.rect(20, 105, 48, 20, "F");
doc.setFillColor(0, 255, 128);
doc.rect(20, 130, 32, 20, "F");

// Leyenda
doc.text("Ventas", 110, 90);
doc.text("Gastos", 110, 115);
doc.text("Ganancia", 110, 140);

doc.save("informe.pdf");
```

### Documento con imagen

```javascript
const doc = new jsPDF();

doc.setFontSize(16);
doc.text("Documento con Imagen", 105, 20, { align: "center" });

// Añadir imagen (requiere imageData como base64 o URL de datos)
const imgData = "data:image/jpeg;base64,/9j/4AAQSkZJRg...";
doc.addImage(imgData, "JPEG", 40, 40, 120, 80);

doc.text("Descripción de la imagen", 105, 130, { align: "center" });

doc.save("con-imagen.pdf");
```

### Tarjeta de visita

```javascript
const doc = new jsPDF({
  orientation: "landscape",
  unit: "mm",
  format: [90, 50]
});

// Borde
doc.setLineWidth(0.5);
doc.rect(2, 2, 86, 46);

// Nombre
doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.text("Juan Pérez", 45, 15, { align: "center" });

// Cargo
doc.setFontSize(12);
doc.setFont("helvetica", "normal");
doc.text("Desarrollador Web", 45, 22, { align: "center" });

// Contacto
doc.setFontSize(10);
doc.text("Tel: +34 123 456 789", 45, 32, { align: "center" });
doc.text("email@ejemplo.com", 45, 38, { align: "center" });

doc.save("tarjeta-visita.pdf");
```

## Consideraciones de Seguridad

**IMPORTANTE:** Siempre sanitiza la entrada del usuario antes de pasarla a jsPDF.

### Seguridad en Node.js

Por defecto, jsPDF restringe la lectura de archivos del sistema local en Node.js.

#### Opción recomendada: Permisos de Node
```bash
node --permission --allow-fs-read=... ./scripts/generar.js
```

#### Alternativa: allowFsRead (no recomendado)
```javascript
import { jsPDF } from "jspdf";

const doc = new jsPDF();
doc.allowFsRead = ["./fonts/*", "./images/logo.png"];
```

### Reportar vulnerabilidades

Consulta el archivo SECURITY.md en el repositorio de GitHub para reportar vulnerabilidades de seguridad.

## Compatibilidad con Navegadores

jsPDF requiere APIs modernas de navegador. Para navegadores antiguos como Internet Explorer, se requieren polyfills:

```javascript
import "jspdf/dist/polyfills.es.js";
```

O usando CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.4/polyfills.umd.js"></script>
```

## Soporte y Contribuciones

### Obtener ayuda
- Stack Overflow: usa el tag `jspdf`
- Issues de GitHub para reportes de bugs y solicitudes de características

### Contribuir
Consulta la guía de contribución en el repositorio de GitHub para información sobre cómo construir y probar jsPDF.

## Licencia

MIT License

Copyright (c) 2010-2025 James Hall  
Copyright (c) 2015-2025 yWorks GmbH

## Recursos Adicionales

- **Repositorio GitHub:** https://github.com/MrRio/jsPDF
- **Documentación API:** https://raw.githack.com/MrRio/jsPDF/master/docs/
- **Demo en vivo:** https://raw.githack.com/MrRio/jsPDF/master/
- **Convertidor de fuentes:** https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html