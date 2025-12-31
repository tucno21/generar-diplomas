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
    visible: boolean;
}

const defaultDiplomaTextConfig: TextConfig[] = [
    {
        key: 'ministerio',
        text: 'MINISTERIO DE EDUCACIÓN',
        top: '20mm',
        left: '50%',
        fontSize: '18px',
        color: '#455a64',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'direccion',
        text: 'DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO',
        top: '25mm',
        left: '50%',
        fontSize: '17px',
        color: '#607d8b',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'unidad',
        text: 'UNIDAD DE GESTIÓN EDUCATIVA LOCAL DE HUANTA',
        top: '29mm',
        left: '50%',
        fontSize: '17px',
        color: '#607d8b',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'institucion',
        text: 'INSTITUCIÓN EDUCATIVA',
        top: '37mm',
        left: '50%',
        fontSize: '22px',
        color: '#37474f',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'nombreInstitucion',
        text: '"JOSÉ FÉLIX IGUAÍN"',
        top: '43mm',
        left: '50%',
        fontSize: '30px',
        color: '#212121',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'diplomaHonor',
        text: 'DIPLOMA DE HONOR',
        top: '57mm',
        left: '50%',
        fontSize: '41px',
        color: '#c9a227',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'puesto',
        top: '76mm',
        left: '50%',
        fontSize: '28px',
        color: '#37474f',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'otorgadoA',
        text: 'OTORGADO A:',
        top: '89mm',
        left: '50%',
        fontSize: '25px',
        color: '#607d8b',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'nombreEstudiante',
        top: '98mm',
        left: '50%',
        fontSize: '29px',
        color: '#212121',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        visible: true
    },
    {
        key: 'descripcion',
        top: '115mm',
        left: '35%',
        fontSize: '25px',
        color: '#455a64',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'justify',
        transform: 'translateX(-30%)',
        visible: true
    },
    {
        key: 'fecha',
        text: 'Luricocha, 31 de diciembre del 2025',
        bottom: '60mm',
        left: '60%',
        fontSize: '18px',
        color: '#455a64',
        fontFamily: 'serif',
        fontWeight: 'normal',
        textAlign: 'center',
        transform: 'translateX(-10%)',
        visible: true
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
        transform: 'translateX(-50%)',
        visible: true
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
