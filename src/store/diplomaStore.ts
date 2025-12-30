import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TextConfig {
    key: string;
    text?: string;
    top?: string;
    left: string;
    right?: string;
    bottom?: string;
    fontSize: string;
    color: string;
    fontFamily: string;
    fontWeight: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    transform?: string;
}

const defaultDiplomaTextConfig: TextConfig[] = [
    {
        key: 'ministerio',
        text: 'MINISTERIO DE EDUCACIÓN',
        top: '15mm',
        left: '50%',
        fontSize: '10px',
        color: '#455a64',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'direccion',
        text: 'DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO',
        top: '22mm',
        left: '50%',
        fontSize: '9px',
        color: '#607d8b',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'unidad',
        text: 'UNIDAD EJECUTORA DE EDUCACIÓN - HUANTA',
        top: '29mm',
        left: '50%',
        fontSize: '9px',
        color: '#607d8b',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'institucion',
        text: 'INSTITUCIÓN EDUCATIVA',
        top: '36mm',
        left: '50%',
        fontSize: '11px',
        color: '#37474f',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'nombreInstitucion',
        text: '"JOSÉ FÉLIX IGUAÍN"',
        top: '45mm',
        left: '50%',
        fontSize: '14px',
        color: '#212121',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'diplomaHonor',
        text: 'DIPLOMA DE HONOR',
        top: '65mm',
        left: '50%',
        fontSize: '28px',
        color: '#c9a227',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'puesto',
        top: '85mm',
        left: '50%',
        fontSize: '22px',
        color: '#37474f',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'otorgadoA',
        text: 'OTORGADO A:',
        top: '105mm',
        left: '50%',
        fontSize: '12px',
        color: '#607d8b',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'nombreEstudiante',
        top: '120mm',
        left: '50%',
        fontSize: '24px',
        color: '#212121',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'descripcion',
        top: '145mm',
        left: '50%',
        fontSize: '14px',
        color: '#455a64',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'fecha',
        text: 'Luricocha, 31 de diciembre del 2025',
        bottom: '25mm',
        left: '50%',
        fontSize: '12px',
        color: '#455a64',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    },
    {
        key: 'director',
        text: 'Director(a)',
        bottom: '12mm',
        left: '50%',
        fontSize: '10px',
        color: '#607d8b',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)'
    }
];

interface DiplomaConfig {
    diplomaTextConfig: TextConfig[];
    updateConfig: (config: TextConfig[]) => void;
    updateSingleConfig: (index: number, config: Partial<TextConfig>) => void;
    resetConfig: () => void;
}

export const useDiplomaStore = create<DiplomaConfig>()(
    persist(
        (set) => ({
            diplomaTextConfig: defaultDiplomaTextConfig,
            updateConfig: (config) => set({ diplomaTextConfig: config }),
            updateSingleConfig: (index, config) =>
                set((state) => ({
                    diplomaTextConfig: state.diplomaTextConfig.map((item, i) =>
                        i === index ? { ...item, ...config } : item
                    ),
                })),
            resetConfig: () => set({ diplomaTextConfig: defaultDiplomaTextConfig }),
        }),
        {
            name: 'diploma-config-storage',
        }
    )
);
