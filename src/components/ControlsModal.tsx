import { useRef } from 'react';

interface Student {
    nombreCompleto: string;
    grado: number;
    seccion: string;
    puesto: number;
    gradoTexto: string;
    puestoTexto: string;
}

interface ControlsModalProps {
    isOpen: boolean;
    onClose: () => void;
    students: Student[];
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDownloadTemplate: () => void;
    onOpenConfigModal: () => void;
    onExportConfig: () => void;
    onImportConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
}

const ControlsModal = ({
    isOpen,
    onClose,
    students,
    onFileUpload,
    onDownloadTemplate,
    onOpenConfigModal,
    onExportConfig,
    onImportConfig,
    onBackgroundUpload,
}: ControlsModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const backgroundFileInputRef = useRef<HTMLInputElement>(null);
    const configImportRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
                <div className="bg-linear-to-r from-purple-900 to-indigo-900 px-6 py-5 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-3xl">🎛️</span>
                        Panel de Control
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-purple-300 text-4xl font-bold transition-colors hover:rotate-90 transform duration-300"
                    >
                        ×
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Gestión de Estudiantes */}
                        <div className="bg-linear-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border-2 border-blue-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
                            <h3 className="text-xl font-bold text-blue-300 mb-5 flex items-center gap-3">
                                <span className="text-3xl">👥</span>
                                Gestión de Estudiantes
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={onFileUpload}
                                        accept=".xlsx,.xls"
                                        className="hidden"
                                        id="file-upload-modal"
                                    />
                                    <label
                                        htmlFor="file-upload-modal"
                                        className="w-full px-5 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 font-semibold cursor-pointer inline-block text-center shadow-lg hover:shadow-blue-600/30 border border-blue-400/30"
                                    >
                                        <div className="text-2xl mb-1">📤</div>
                                        <div>Cargar Archivo Excel</div>
                                    </label>
                                </div>
                                <button
                                    onClick={onDownloadTemplate}
                                    className="w-full px-5 py-4 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-blue-500/30 border border-blue-400/30"
                                >
                                    <div className="text-2xl mb-1">📥</div>
                                    <div>Descargar Plantilla</div>
                                </button>
                                {students.length > 0 && (
                                    <div className="mt-4 p-4 bg-blue-900/40 rounded-lg border border-blue-700/50">
                                        <p className="text-blue-200 text-center font-medium">
                                            ✅ {students.length} estudiante{students.length !== 1 ? 's' : ''} cargado{students.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Configuración del Diploma */}
                        <div className="bg-linear-to-br from-indigo-900/50 to-indigo-800/30 rounded-xl p-6 border-2 border-indigo-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20">
                            <h3 className="text-xl font-bold text-indigo-300 mb-5 flex items-center gap-3">
                                <span className="text-3xl">⚙️</span>
                                Configuración del Diploma
                            </h3>
                            <div className="space-y-4">
                                <button
                                    onClick={onOpenConfigModal}
                                    className="w-full px-5 py-4 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-500 hover:to-indigo-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-indigo-600/30 border border-indigo-400/30"
                                >
                                    <div className="text-2xl mb-1">🎨</div>
                                    <div>Configurar Diploma</div>
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={onExportConfig}
                                        className="px-4 py-4 bg-linear-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-amber-600/30 border border-amber-400/30"
                                    >
                                        <div className="text-xl mb-1">💾</div>
                                        <div className="text-sm">Exportar</div>
                                    </button>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            ref={configImportRef}
                                            onChange={onImportConfig}
                                            accept=".json"
                                            className="hidden"
                                            id="config-import-modal"
                                        />
                                        <label
                                            htmlFor="config-import-modal"
                                            className="w-full h-full px-4 py-4 bg-linear-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-500 hover:to-rose-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-rose-600/30 border border-rose-400/30 cursor-pointer inline-block text-center"
                                        >
                                            <div className="text-xl mb-1">📂</div>
                                            <div className="text-sm">Importar</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personalización */}
                        <div className="bg-linear-to-br from-teal-900/50 to-teal-800/30 rounded-xl p-6 border-2 border-teal-700/50 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-900/20">
                            <h3 className="text-xl font-bold text-teal-300 mb-5 flex items-center gap-3">
                                <span className="text-3xl">🖼️</span>
                                Personalización
                            </h3>
                            <div>
                                <input
                                    type="file"
                                    ref={backgroundFileInputRef}
                                    onChange={onBackgroundUpload}
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="hidden"
                                    id="background-upload-modal"
                                />
                                <label
                                    htmlFor="background-upload-modal"
                                    className="w-full px-5 py-4 bg-linear-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-500 hover:to-teal-600 transition-all duration-300 font-semibold cursor-pointer inline-block text-center shadow-lg hover:shadow-teal-600/30 border border-teal-400/30"
                                >
                                    <div className="text-2xl mb-1">🎭</div>
                                    <div>Cambiar Fondo del Diploma</div>
                                </label>
                            </div>
                            <div className="mt-6 p-4 bg-teal-900/40 rounded-lg border border-teal-700/50">
                                <p className="text-teal-200 text-sm text-center">
                                    💡 Formatos aceptados: PNG, JPG, JPEG
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 px-6 py-5 flex justify-end border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-purple-600/30 border border-purple-400/30"
                    >
                        Cerrar Panel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlsModal;
