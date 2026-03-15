// ==================== MOCK DATA ====================

// Datos de Pacientes
const patientsData = [
    {
        id: '1',
        name: 'María González',
        age: 45,
        gender: 'Femenino',
        email: 'maria.g@email.com',
        phone: '+34 612 345 678',
        address: 'Calle Mayor 123, Madrid',
        allergies: ['Penicilina', 'Polen'],
        chronicConditions: ['Hipertensión'],
        medications: ['Enalapril 10mg'],
        bloodType: 'A+'
    },
    {
        id: '2',
        name: 'Juan Pérez',
        age: 32,
        gender: 'Masculino',
        email: 'juan.p@email.com',
        phone: '+34 623 456 789',
        address: 'Av. Libertad 45, Barcelona',
        allergies: [],
        chronicConditions: ['Asma'],
        medications: ['Salbutamol'],
        bloodType: 'O+'
    },
    {
        id: '3',
        name: 'Ana Martínez',
        age: 28,
        gender: 'Femenino',
        email: 'ana.m@email.com',
        phone: '+34 634 567 890',
        address: 'Plaza España 78, Valencia',
        allergies: ['Látex'],
        chronicConditions: [],
        medications: [],
        bloodType: 'B+'
    },
    {
        id: '4',
        name: 'Carlos Rodríguez',
        age: 56,
        gender: 'Masculino',
        email: 'carlos.r@email.com',
        phone: '+34 645 678 901',
        address: 'Calle Sevilla 234, Sevilla',
        allergies: [],
        chronicConditions: ['Diabetes Tipo 2', 'Colesterol Alto'],
        medications: ['Metformina 850mg', 'Atorvastatina 20mg'],
        bloodType: 'AB+'
    }
];

// Datos de Citas
const appointmentsData = [
    {
        id: '1',
        patientName: 'María González',
        patientId: '1',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'Consulta General',
        status: 'confirmada',
        doctor: 'Dr. López'
    },
    {
        id: '2',
        patientName: 'Juan Pérez',
        patientId: '2',
        date: new Date().toISOString().split('T')[0],
        time: '10:30',
        type: 'Revisión',
        status: 'pendiente',
        doctor: 'Dr. López'
    },
    {
        id: '3',
        patientName: 'Ana Martínez',
        patientId: '3',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        type: 'Primera Consulta',
        status: 'confirmada',
        doctor: 'Dr. López'
    },
    {
        id: '4',
        patientName: 'Carlos Rodríguez',
        patientId: '4',
        date: new Date().toISOString().split('T')[0],
        time: '15:00',
        type: 'Control',
        status: 'completada',
        doctor: 'Dra. García'
    }
];

// Datos de Facturas
const invoicesData = [
    {
        id: 'INV-001',
        patientName: 'María González',
        patientId: '1',
        date: '2026-01-09',
        amount: 120.00,
        status: 'pagado',
        items: [
            { description: 'Consulta General', price: 80.00 },
            { description: 'Análisis de Sangre', price: 40.00 }
        ],
        insurance: 'Seguro Salud Plus'
    },
    {
        id: 'INV-002',
        patientName: 'Juan Pérez',
        patientId: '2',
        date: '2026-01-08',
        amount: 150.00,
        status: 'pendiente',
        items: [
            { description: 'Consulta Especializada', price: 120.00 },
            { description: 'Radiografía', price: 30.00 }
        ],
        insurance: null
    },
    {
        id: 'INV-003',
        patientName: 'Ana Martínez',
        patientId: '3',
        date: '2025-12-25',
        amount: 200.00,
        status: 'vencido',
        items: [
            { description: 'Consulta General', price: 80.00 },
            { description: 'Ecografía', price: 120.00 }
        ],
        insurance: 'Medicare Premium'
    },
    {
        id: 'INV-004',
        patientName: 'Carlos Rodríguez',
        patientId: '4',
        date: '2026-01-10',
        amount: 180.00,
        status: 'pagado',
        items: [
            { description: 'Control Diabetes', price: 100.00 },
            { description: 'Análisis Completo', price: 80.00 }
        ],
        insurance: 'Asistencia Básica'
    }
];

// Datos de Pagos
const paymentsData = [
    {
        id: 'PAY-001',
        invoiceId: 'INV-001',
        patientName: 'María González',
        amount: 120.00,
        method: 'Tarjeta de Crédito',
        date: '2026-01-09'
    },
    {
        id: 'PAY-002',
        invoiceId: 'INV-004',
        patientName: 'Carlos Rodríguez',
        amount: 180.00,
        method: 'Transferencia Bancaria',
        date: '2026-01-10'
    }
];

// Datos para Gráficas
const monthlyRevenueData = [
    { month: 'Jul', revenue: 4200 },
    { month: 'Ago', revenue: 5100 },
    { month: 'Sep', revenue: 4800 },
    { month: 'Oct', revenue: 6200 },
    { month: 'Nov', revenue: 5500 },
    { month: 'Dic', revenue: 6800 }
];

// Tarifario de Servicios
const servicesData = [
    {
        id: '1',
        name: 'Consulta General',
        description: 'Consulta médica estándar',
        price: 80.00
    },
    {
        id: '2',
        name: 'Consulta Especializada',
        description: 'Consulta con especialista',
        price: 120.00
    },
    {
        id: '3',
        name: 'Análisis de Sangre',
        description: 'Examen de laboratorio completo',
        price: 40.00
    },
    {
        id: '4',
        name: 'Radiografía',
        description: 'Estudio radiológico',
        price: 30.00
    },
    {
        id: '5',
        name: 'Ecografía',
        description: 'Estudio ecográfico',
        price: 120.00
    }
];

// Doctores disponibles
const doctorsData = [
    { id: '1', name: 'Dr. López' },
    { id: '2', name: 'Dra. García' },
    { id: '3', name: 'Dr. Martínez' }
];
