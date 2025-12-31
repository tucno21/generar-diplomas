import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ConfigModal from './components/ConfigModal';
import ControlsModal from './components/ControlsModal';
import { useDiplomaStore } from './store/diplomaStore';

interface Student {
  nombreCompleto: string;
  grado: number;
  seccion: string;
  puesto: number;
  gradoTexto: string;
  puestoTexto: string;
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('/diploma.png');
  const [imageError, setImageError] = useState<string>('');
  const diplomaRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const diplomaTextConfig = useDiplomaStore((state) => state.diplomaTextConfig);
  const updateConfig = useDiplomaStore((state) => state.updateConfig);

  const gradoMap: Record<number, string> = {
    1: 'primero',
    2: 'segundo',
    3: 'tercer',
    4: 'cuarto',
    5: 'quinto',
  };

  const puestoMap: Record<number, string> = {
    1: 'primer puesto',
    2: 'segundo puesto',
    3: 'tercer puesto',
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');

    // Validar tipo de archivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setImageError('Error: Solo se permiten archivos PNG, JPG o JPEG');
      return;
    }

    // Validar tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setImageError('Error: El archivo excede el tamaño máximo de 5MB');
      return;
    }

    // Leer y validar dimensiones de la imagen
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Validar dimensiones (A4 landscape a 300 DPI = 3508x2482px)
        const minWidth = 1000;
        const minHeight = 700;
        const maxWidth = 3508;
        const maxHeight = 2482;

        if (width < minWidth || height < minHeight) {
          setImageError(`Error: La imagen es muy pequeña. Mínimo requerido: ${minWidth}x${minHeight}px. Tamaño actual: ${width}x${height}px`);
          return;
        }

        if (width > maxWidth || height > maxHeight) {
          setImageError(`Error: La imagen excede el tamaño máximo de A4. Máximo: ${maxWidth}x${maxHeight}px (A4 a 300 DPI). Tamaño actual: ${width}x${height}px`);
          return;
        }

        // Validar relación de aspecto (A4 landscape ≈ 1.414)
        const aspectRatio = width / height;
        const targetAspectRatio = 3508 / 2482; // 1.414 (A4 landscape)
        const tolerance = 0.1; // 10% de tolerancia

        if (Math.abs(aspectRatio - targetAspectRatio) > tolerance) {
          setImageError(`Advertencia: La relación de aspecto de la imagen (${aspectRatio.toFixed(2)}) no coincide con el formato A4 landscape (${targetAspectRatio.toFixed(2)}). Esto puede afectar la apariencia del diploma. Se recomienda una imagen proporcional a ${maxWidth}x${maxHeight}px`);
        }

        // Si pasó todas las validaciones, cargar la imagen
        const base64 = event.target?.result as string;
        setBackgroundImage(base64);
      };

      img.onerror = () => {
        setImageError('Error: No se pudo cargar la imagen. Por favor intenta con otro archivo.');
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Nombre Completo': 'Juan Pérez García',
        'Grado': 5,
        'Sección': 'A',
        'Puesto': 1,
      },
      {
        'Nombre Completo': 'María Rodríguez López',
        'Grado': 4,
        'Sección': 'B',
        'Puesto': 2,
      },
      {
        'Nombre Completo': 'Carlos Martínez Sánchez',
        'Grado': 3,
        'Sección': 'A',
        'Puesto': 3,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
    XLSX.writeFile(wb, 'plantilla_diplomas.xlsx');
  };

  const exportConfig = () => {
    const config = {
      diplomaTextConfig: diplomaTextConfig,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diploma-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (!data.diplomaTextConfig || !Array.isArray(data.diplomaTextConfig)) {
          throw new Error('Formato de archivo inválido. El archivo debe cont diplomaTextConfig');
        }

        updateConfig(data.diplomaTextConfig);
        alert('Configuración importada exitosamente');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al importar la configuración');
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        console.log('Iniciando procesamiento del archivo...');
        const data = event.target?.result;

        if (!data) {
          throw new Error('No se pudo leer el archivo');
        }

        const workbook = XLSX.read(data as ArrayBuffer, { type: 'array' });
        console.log('Libro leído:', workbook.SheetNames);

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Datos extraídos:', jsonData);

        if (!jsonData || jsonData.length === 0) {
          throw new Error('El archivo Excel no contiene datos o está vacío');
        }

        const processedData: Student[] = jsonData.map((row: any) => {
          const grado = Number(row['Grado']);
          const puesto = Number(row['Puesto']);

          if (!gradoMap[grado]) {
            throw new Error(`Grado inválido: ${grado}. Debe ser un número del 1 al 5.`);
          }
          if (!puestoMap[puesto]) {
            throw new Error(`Puesto inválido: ${puesto}. Debe ser un número del 1 al 3.`);
          }

          return {
            nombreCompleto: String(row['Nombre Completo'] || '').toUpperCase(),
            grado,
            seccion: String(row['Sección'] || ''),
            puesto,
            gradoTexto: gradoMap[grado],
            puestoTexto: puestoMap[puesto],
          };
        });

        console.log('Datos procesados:', processedData);
        setStudents(processedData);
        setPreviewIndex(0);
        console.log('Estado actualizado exitosamente');
      } catch (err) {
        console.error('Error al procesar el archivo:', err);
        setError(err instanceof Error ? err.message : 'Error al procesar el archivo Excel');
      } finally {
        setLoading(false);
        console.log('Carga completada');
      }
    };

    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      setError('Error al leer el archivo. Por favor intenta con otro archivo.');
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const DiplomaPreview = ({ student, isHidden }: { student: Student; isHidden?: boolean }) => {
    const setRef = (el: HTMLDivElement | null) => {
      if (el) {
        diplomaRefs.current[student.nombreCompleto] = el;
      }
    };

    // Get text for dynamic fields
    const getDynamicText = (key: string): string => {
      switch (key) {
        case 'puesto':
          return student.puestoTexto.toUpperCase();
        case 'nombreEstudiante':
          return student.nombreCompleto;
        case 'descripcion':
          return `Del ${student.gradoTexto} grado sección "${student.seccion}", de la I.E. "José Félix Iguaín" nivel secundaria, en mérito a su aprovechamiento y conducta durante el año académico 2025`;
        default:
          return '';
      }
    };

    return (
      <div
        className="flex items-center justify-center"
        ref={setRef}
        style={{
          position: isHidden ? 'absolute' : 'relative',
          left: isHidden ? '-9999px' : 'auto',
          top: isHidden ? '-9999px' : 'auto',
          zIndex: isHidden ? -1 : 1
        }}
      >
        <div
          id={`diploma-${student.nombreCompleto}`}
          className="relative w-[297mm] h-[210mm] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            pageBreakAfter: 'always'
          }}
        >
          {/* Render all text elements from config */}
          {diplomaTextConfig.map((config) => {
            if (!config.visible) return null;

            const text = config.text || getDynamicText(config.key);
            return (
              <div
                key={config.key}
                style={{
                  position: 'absolute',
                  top: config.top || 'auto',
                  left: config.left || 'auto',
                  right: config.right || 'auto',
                  bottom: config.bottom || 'auto',
                  fontSize: config.fontSize,
                  color: config.color,
                  fontFamily: config.fontFamily,
                  fontWeight: config.fontWeight,
                  textAlign: config.textAlign,
                  transform: config.transform
                }}
              >
                {text}
              </div>
            );
          })}

          {/* Signature line */}
          <div
            style={{
              position: 'absolute',
              bottom: '20mm',
              left: '50%',
              width: '150px',
              height: '1px',
              backgroundColor: '#bdbdbd',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>
      </div>
    );
  };

  const generatePDF = async (single: boolean = false) => {
    setGeneratingPDF(true);
    setError('');

    try {
      if (single) {
        const element = document.getElementById(`diploma-${students[previewIndex].nombreCompleto}`);
        if (!element) throw new Error('Elemento no encontrado');

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`diploma-${students[previewIndex].nombreCompleto.replace(/\s+/g, '_')}.pdf`);
      } else {
        // Store original preview index to restore it later
        const originalPreviewIndex = previewIndex;
        const containerRefs = diplomaRefs.current;

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        });

        // Save current visibility state
        const originalVisibility = Object.keys(containerRefs).map(key => ({
          key,
          container: containerRefs[key]
        }));

        for (let i = 0; i < students.length; i++) {
          // Hide all containers
          originalVisibility.forEach(({ container }) => {
            if (container) {
              container.style.position = 'absolute';
              container.style.left = '-9999px';
              container.style.top = '-9999px';
              container.style.zIndex = '-1';
            }
          });

          // Make current container visible
          const currentContainer = containerRefs[students[i].nombreCompleto];
          if (currentContainer) {
            currentContainer.style.position = 'relative';
            currentContainer.style.left = 'auto';
            currentContainer.style.top = 'auto';
            currentContainer.style.zIndex = '1';
          }

          // Wait for DOM to update
          await new Promise(resolve => setTimeout(resolve, 100));

          if (i > 0) pdf.addPage();

          const element = document.getElementById(`diploma-${students[i].nombreCompleto}`);
          if (!element) continue;

          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
          });

          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save('diplomas_completos.pdf');

        // Restore original visibility
        originalVisibility.forEach(({ key }, index) => {
          const container = containerRefs[key];
          if (container) {
            const isVisible = index === originalPreviewIndex;
            container.style.position = isVisible ? 'relative' : 'absolute';
            container.style.left = isVisible ? 'auto' : '-9999px';
            container.style.top = isVisible ? 'auto' : '-9999px';
            container.style.zIndex = isVisible ? '1' : '-1';
          }
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-indigo-400">
              🎓 Generador de Diplomas de Honor
            </h1>
            <p className="text-gray-400">
              Sistema de generación de diplomas con configuración personalizada
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsControlsModalOpen(true)}
              className="px-6 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 font-bold text-sm shadow-2xl hover:shadow-purple-600/40 border-2 border-purple-400/30 flex items-center gap-3"
            >
              <span className="">🎛️</span>
              Abrir Panel de Control
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-900/50 border-2 border-blue-500/50 rounded-xl text-blue-200 text-center font-semibold shadow-lg shadow-blue-900/20">
            ⏳ Procesando archivo...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border-2 border-red-500/50 rounded-xl text-red-200 shadow-lg shadow-red-900/20">
            ⚠️ {error}
          </div>
        )}

        {imageError && (
          <div className="mb-6 p-4 bg-yellow-900/50 border-2 border-yellow-500/50 rounded-xl text-yellow-200 shadow-lg shadow-yellow-900/20">
            ⚠️ {imageError}
          </div>
        )}


      </div>

      {/* Preview Controls */}
      {students.length > 0 && (
        <div className="bg-linear-to-r from-purple-900/50 to-orange-900/50 rounded-2xl shadow-2xl px-6 py-1 mb-4 border-2 border-purple-500/50">
          <div className="flex gap-x-4 p-2 items-center justify-between">
            {/* Header */}
            <h3 className="text-xl font-bold text-purple-200 text-center flex items-center justify-center gap-3">
              <span className="text-2xl">🎯</span>
              Generación de Diplomas
            </h3>

            {/* Status Message */}
            {students.length > 0 && (
              <div className="p-1 bg-linear-to-r from-green-900/50 to-emerald-900/50 border-2 border-green-500/50 rounded-xl text-green-200 text-center text-md shadow-lg shadow-green-900/20">
                ✅ {students.length} estudiante{students.length !== 1 ? 's' : ''} cargado{students.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* Student Selection */}
            <div className="flex">
              <select
                value={previewIndex}
                onChange={(e) => setPreviewIndex(Number(e.target.value))}
                className="px-4 py-2 border-2 border-purple-500/50 bg-gray-900/50 text-purple-100 rounded-lg text-sm focus:outline-none font-medium hover:border-purple-400/50 transition-colors"
              >
                {students.map((student, index) => (
                  <option key={index} value={index} className="text-gray-900">
                    {index + 1}. {student.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>

            {/* PDF Generation Buttons */}
            <button
              onClick={() => generatePDF(true)}
              disabled={generatingPDF}
              className="px-4 py-2 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl text-sm hover:from-purple-500 hover:to-purple-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-purple-600/40 border-2 border-purple-400/30"
            >
              {generatingPDF ? '⏳ Generando...' : '📄 PDF Actual'}
            </button>

            <button
              onClick={() => generatePDF(false)}
              disabled={generatingPDF}
              className="px-4 py-2 bg-linear-to-r from-orange-600 to-orange-700 text-white rounded-xl text-sm hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-orange-600/40 border-2 border-orange-400/30"
            >
              {generatingPDF ? '⏳ Generando...' : '📄Todos los Diplomas'}
            </button>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">

          </div>
        </div>
      )}


      {/* All Diplomas - rendered once, only preview is visible */}
      {students.length > 0 && (
        <>
          {students.map((student, index) => (
            <DiplomaPreview
              key={index}
              student={student}
              isHidden={index !== previewIndex}
            />
          ))}
        </>
      )}

      {/* Loading Overlay */}
      {generatingPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-12 flex flex-col items-center border-2 border-purple-500/50">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
              <div
                className="absolute inset-0 border-8 border-blue-600 rounded-full animate-spin"
                style={{
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                }}
              ></div>
              <div className="absolute inset-2 border-8 border-purple-200 rounded-full"></div>
              <div
                className="absolute inset-2 border-8 border-purple-600 rounded-full animate-spin"
                style={{
                  animationDirection: 'reverse',
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'transparent',
                  animationDuration: '1.5s',
                }}
              ></div>
            </div>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 mb-3">
              Generando Diplomas
            </h3>
            <p className="text-gray-300 text-center mb-6 text-lg">
              Por favor espere mientras se generan los PDFs...
            </p>
            <div className="flex items-center gap-3 text-purple-400">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Controls Modal */}
      <ControlsModal
        isOpen={isControlsModalOpen}
        onClose={() => setIsControlsModalOpen(false)}
        students={students}
        onFileUpload={handleFileUpload}
        onDownloadTemplate={downloadTemplate}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onExportConfig={exportConfig}
        onImportConfig={importConfig}
        onBackgroundUpload={handleBackgroundUpload}
        loading={loading}
      />

      {/* Diploma Preview Container */}
      {students.length > 0 && (
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-2 overflow-auto border-2 border-purple-500/30 mt-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-indigo-400 text-center">
            📄 Vista Previa del Diploma
          </h2>
        </div>
      )}
    </div>
  );
}

export default App;
