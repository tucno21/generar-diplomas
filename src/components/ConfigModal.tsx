import { useState } from 'react';
import { useDiplomaStore } from '../store/diplomaStore';
import type { TextConfig } from '../store/diplomaStore';

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConfigModal = ({ isOpen, onClose }: ConfigModalProps) => {
    const { diplomaTextConfig, updateSingleConfig, resetConfig } = useDiplomaStore();
    const [localConfig, setLocalConfig] = useState<TextConfig[]>(diplomaTextConfig);

    const handleChange = (index: number, field: keyof TextConfig, value: any) => {
        const updated = [...localConfig];
        updated[index] = { ...updated[index], [field]: value };
        setLocalConfig(updated);
    };

    const handleSave = () => {
        localConfig.forEach((config, index) => {
            updateSingleConfig(index, config);
        });
        onClose();
    };

    const handleReset = () => {
        resetConfig();
        setLocalConfig(useDiplomaStore.getState().diplomaTextConfig);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-70 p-4 backdrop-blur-sm">
            <div className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
                <div className="bg-linear-to-r from-indigo-900 to-purple-900 px-8 py-3 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-3xl">🎨</span>
                        Configuración del Diploma
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-purple-300 text-4xl font-bold transition-colors"
                    >
                        ×
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 bg-linear-to-br from-gray-900/50 to-gray-800/30">
                    <div className="space-y-6">
                        {localConfig.map((config, index) => (
                            <div key={config.key} className="border border-gray-700/50 rounded-xl p-6 bg-linear-to-br from-gray-800/40 to-gray-700/30 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xl font-bold text-indigo-300 capitalize flex items-center gap-2">
                                        <span className="text-2xl">📝</span>
                                        {config.key}
                                    </h3>
                                    <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-600/50">
                                        <label htmlFor={`visible-${config.key}`} className="text-sm font-bold text-gray-300 cursor-pointer hover:text-indigo-300 transition-colors">
                                            Visible
                                        </label>
                                        <input
                                            type="checkbox"
                                            id={`visible-${config.key}`}
                                            checked={config.visible}
                                            onChange={(e) => handleChange(index, 'visible', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 cursor-pointer bg-gray-800"
                                        />
                                    </div>
                                </div>

                                {config.text !== undefined && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            Texto
                                        </label>
                                        <input
                                            type="text"
                                            value={config.text}
                                            onChange={(e) => handleChange(index, 'text', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {config.top !== undefined && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                                Posición superior (top)
                                            </label>
                                            <input
                                                type="text"
                                                value={config.top}
                                                onChange={(e) => handleChange(index, 'top', e.target.value)}
                                                placeholder="ej: 15mm o 50px"
                                                className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            Posición izquierda (left)
                                        </label>
                                        <input
                                            type="text"
                                            value={config.left}
                                            onChange={(e) => handleChange(index, 'left', e.target.value)}
                                            placeholder="ej: 50% o 20mm"
                                            className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                        />
                                    </div>

                                    {config.right !== undefined && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                                Posición derecha (right)
                                            </label>
                                            <input
                                                type="text"
                                                value={config.right}
                                                onChange={(e) => handleChange(index, 'right', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                            />
                                        </div>
                                    )}

                                    {config.bottom !== undefined && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                                Posición inferior (bottom)
                                            </label>
                                            <input
                                                type="text"
                                                value={config.bottom}
                                                onChange={(e) => handleChange(index, 'bottom', e.target.value)}
                                                placeholder="ej: 25mm"
                                                className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            Tamaño de fuente
                                        </label>
                                        <input
                                            type="text"
                                            value={config.fontSize}
                                            onChange={(e) => handleChange(index, 'fontSize', e.target.value)}
                                            placeholder="ej: 14px"
                                            className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            Color
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={config.color}
                                                onChange={(e) => handleChange(index, 'color', e.target.value)}
                                                className="w-12 h-10 border border-gray-600/50 rounded cursor-pointer bg-gray-900/50"
                                            />
                                            <input
                                                type="text"
                                                value={config.color}
                                                onChange={(e) => handleChange(index, 'color', e.target.value)}
                                                placeholder="#000000"
                                                className="flex-1 px-4 py-2.5 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            Tipografía
                                        </label>
                                        <select
                                            value={config.fontFamily}
                                            onChange={(e) => handleChange(index, 'fontFamily', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                        >
                                            <option value="serif" className="text-gray-900">Serif</option>
                                            <option value="sans-serif" className="text-gray-900">Sans-serif</option>
                                            <option value="monospace" className="text-gray-900">Monospace</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            Grosor
                                        </label>
                                        <select
                                            value={config.fontWeight}
                                            onChange={(e) => handleChange(index, 'fontWeight', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                        >
                                            <option value="normal" className="text-gray-900">Normal</option>
                                            <option value="bold" className="text-gray-900">Bold</option>
                                            <option value="italic" className="text-gray-900">Italic</option>
                                            <option value="bold italic" className="text-gray-900">Bold Italic</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            Alineación
                                        </label>
                                        <select
                                            value={config.textAlign}
                                            onChange={(e) => handleChange(index, 'textAlign', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                        >
                                            <option value="left" className="text-gray-900">Izquierda</option>
                                            <option value="center" className="text-gray-900">Centro</option>
                                            <option value="right" className="text-gray-900">Derecha</option>
                                            <option value="justify" className="text-gray-900">Justificado</option>
                                        </select>
                                    </div>

                                    {config.transform !== undefined && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                                Transformación CSS
                                            </label>
                                            <input
                                                type="text"
                                                value={config.transform}
                                                onChange={(e) => handleChange(index, 'transform', e.target.value)}
                                                placeholder="ej: translateX(-50%)"
                                                className="w-full px-4 py-2 border border-gray-600/50 bg-gray-900/50 text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400/50 transition-colors"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800/50 px-8 py-5 flex justify-end gap-3 border-t border-gray-700">
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-600/30 border border-red-400/30"
                    >
                        🔄 Restablecer
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-linear-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-gray-600/30 border border-gray-400/30"
                    >
                        ✖️ Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-300 font-bold shadow-lg hover:shadow-green-600/30 border border-green-400/30"
                    >
                        ✅ Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigModal;
