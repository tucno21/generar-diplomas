# Prompt para Generación de Diplomas de Honor

Crea una aplicación React con TypeScript y Tailwind CSS para generar diplomas de honor automáticamente desde un archivo Excel. La aplicación debe cumplir con los siguientes requisitos:

## Funcionalidades principales:

1. **Descarga de plantilla Excel**: Botón para descargar una plantilla Excel (.xlsx) con las siguientes columnas:
   - Nombre Completo
   - Grado (número: 1-5)
   - Sección (letra)
   - Puesto (número: 1-3)

2. **Carga de archivo Excel**: Botón para subir el archivo Excel con los datos de múltiples estudiantes. Usar la librería `xlsx` (SheetJS) para procesar el archivo.

3. **Conversión de datos**:
   - Grado: 1→"primero", 2→"segundo", 3→"tercer", 4→"cuarto", 5→"quinto"
   - Puesto: 1→"primer puesto", 2→"segundo puesto", 3→"tercer puesto"

4. **Vista previa**: Mostrar en pantalla el primer diploma generado con los datos procesados para verificación visual.

5. **Generación de PDFs**: Usar `jsPDF` o similar para generar diplomas en formato PDF tamaño A4 horizontal (landscape) para cada estudiante del Excel.

6. **Diseño del diploma**: 
   - Fondo con imagen decorativa (usar una imagen de diploma elegante)
   - Texto centrado y bien distribuido con la siguiente estructura:
```
     MINISTERIO DE EDUCACIÓN
     DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO
     UNIDAD EJECUTORA DE EDUCACIÓN - HUANTA
     INSTITUCIÓN EDUCATIVA
     "JOSÉ FÉLIX IGUAÍN"
     
     DIPLOMA DE HONOR
     [PUESTO CONVERTIDO]
     
     OTORGADO A:
     [NOMBRE COMPLETO EN MAYÚSCULAS]
     
     Del [grado convertido] grado sección "[sección]", de la I.E. "José Félix Iguaín" 
     nivel secundaria, en mérito a su aprovechamiento y conducta durante el año 
     académico 2025
     
     Luricocha, 31 de diciembre del 2025
```

7. **Tipografía**: Usar fuentes elegantes (ej: serif para títulos, sans-serif para texto)

8. **Interfaz de usuario**:
   - Diseño limpio y profesional con Tailwind CSS
   - Botones claramente etiquetados
   - Indicadores de carga durante el procesamiento
   - Mensajes de error si el formato del Excel es incorrecto

9. **Funcionalidad de impresión**: Botón para descargar todos los PDFs generados (uno por estudiante) o generar un PDF único con todos los diplomas.

## Librerías necesarias:
- `xlsx` o `sheetjs` para procesar Excel
- `jspdf` y `html2canvas` para generar PDFs
- React hooks para manejo de estado

## Requerimientos técnicos:
- React con TypeScript
- Tailwind CSS para estilos
- Código completo funcional
- Buenas prácticas de desarrollo
- Manejo adecuado de errores
- Interfaz intuitiva y responsiva

Genera el código completo con todos los componentes necesarios para que la aplicación sea completamente funcional.