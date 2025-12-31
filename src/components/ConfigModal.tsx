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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Configuración del Diploma</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 text-3xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-6">
                        {localConfig.map((config, index) => (
                            <div key={config.key} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 capitalize">
                                        {config.key}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor={`visible-${config.key}`} className="text-sm font-medium text-gray-700">
                                            Visible
                                        </label>
                                        <input
                                            type="checkbox"
                                            id={`visible-${config.key}`}
                                            checked={config.visible}
                                            onChange={(e) => handleChange(index, 'visible', e.target.checked)}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {config.text !== undefined && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Texto
                                        </label>
                                        <input
                                            type="text"
                                            value={config.text}
                                            onChange={(e) => handleChange(index, 'text', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {config.top !== undefined && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Posición superior (top)
                                            </label>
                                            <input
                                                type="text"
                                                value={config.top}
                                                onChange={(e) => handleChange(index, 'top', e.target.value)}
                                                placeholder="ej: 15mm o 50px"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Posición izquierda (left)
                                        </label>
                                        <input
                                            type="text"
                                            value={config.left}
                                            onChange={(e) => handleChange(index, 'left', e.target.value)}
                                            placeholder="ej: 50% o 20mm"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {config.right !== undefined && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Posición derecha (right)
                                            </label>
                                            <input
                                                type="text"
                                                value={config.right}
                                                onChange={(e) => handleChange(index, 'right', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    {config.bottom !== undefined && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Posición inferior (bottom)
                                            </label>
                                            <input
                                                type="text"
                                                value={config.bottom}
                                                onChange={(e) => handleChange(index, 'bottom', e.target.value)}
                                                placeholder="ej: 25mm"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tamaño de fuente
                                        </label>
                                        <input
                                            type="text"
                                            value={config.fontSize}
                                            onChange={(e) => handleChange(index, 'fontSize', e.target.value)}
                                            placeholder="ej: 14px"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Color
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={config.color}
                                                onChange={(e) => handleChange(index, 'color', e.target.value)}
                                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={config.color}
                                                onChange={(e) => handleChange(index, 'color', e.target.value)}
                                                placeholder="#000000"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipografía
                                        </label>
                                        <select
                                            value={config.fontFamily}
                                            onChange={(e) => handleChange(index, 'fontFamily', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="serif">Serif</option>
                                            <option value="sans-serif">Sans-serif</option>
                                            <option value="monospace">Monospace</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Grosor
                                        </label>
                                        <select
                                            value={config.fontWeight}
                                            onChange={(e) => handleChange(index, 'fontWeight', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="bold">Bold</option>
                                            <option value="italic">Italic</option>
                                            <option value="bold italic">Bold Italic</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Alineación
                                        </label>
                                        <select
                                            value={config.textAlign}
                                            onChange={(e) => handleChange(index, 'textAlign', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="left">Izquierda</option>
                                            <option value="center">Centro</option>
                                            <option value="right">Derecha</option>
                                            <option value="justify">Justificado</option>
                                        </select>
                                    </div>

                                    {config.transform !== undefined && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Transformación CSS
                                            </label>
                                            <input
                                                type="text"
                                                value={config.transform}
                                                onChange={(e) => handleChange(index, 'transform', e.target.value)}
                                                placeholder="ej: translateX(-50%)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3 border-t">
                    <button
                        onClick={handleReset}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                        Restablecer Valores
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigModal;
