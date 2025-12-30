import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ConfigModal from './components/ConfigModal';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const diplomaRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const diplomaTextConfig = useDiplomaStore((state) => state.diplomaTextConfig);

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
        className="dioma-container"
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
            backgroundImage: "url('/diploma.png')",
            pageBreakAfter: 'always'
          }}
        >
          {/* Render all text elements from config */}
          {diplomaTextConfig.map((config) => {
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Generador de Diplomas de Honor
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button
              onClick={downloadTemplate}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              📥 Descargar Plantilla Excel
            </button>

            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              ⚙️ Configurar Diploma
            </button>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold cursor-pointer inline-block"
              >
                📤 Cargar Archivo Excel
              </label>
            </div>
          </div>

          {loading && (
            <div className="mt-4 text-center text-blue-600 font-semibold">
              Procesando archivo...
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {students.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-gray-700">
                {students.length} estudiante{students.length !== 1 ? 's' : ''} cargado{students.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Preview Controls */}
        {students.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Vista previa:</span>
                <select
                  value={previewIndex}
                  onChange={(e) => setPreviewIndex(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {students.map((student, index) => (
                    <option key={index} value={index}>
                      {index + 1}. {student.nombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => generatePDF(true)}
                disabled={generatingPDF}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPDF ? 'Generando...' : '📄 Descargar PDF Actual'}
              </button>

              <button
                onClick={() => generatePDF(false)}
                disabled={generatingPDF}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPDF ? 'Generando...' : '📚 Descargar Todos los PDFs'}
              </button>
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

        {/* Config Modal */}
        <ConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
        />

        {/* Diploma Preview Container */}
        {students.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 overflow-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Vista Previa del Diploma
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
