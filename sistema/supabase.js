// ==================== SUPABASE CONFIGURATION ====================

const SUPABASE_URL = 'https://rvepvftlvadbdrggzwga.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_uIt9jDdxfDcEyYYN5dxSNw_0lgr9W7a';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== AUTHENTICATION FUNCTIONS ====================

async function signIn(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // After login, get user profile
        const { data: profile, error: profileError } = await supabaseClient
            .from('perfiles_usuarios')
            .select('*')
            .eq('usuario_id', data.user.id)
            .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
        }
        
        return { success: true, user: data.user, profile: profile };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error) throw error;
        
        if (user) {
            const { data: profile } = await supabaseClient
                .from('perfiles_usuarios')
                .select('*')
                .eq('usuario_id', user.id)
                .single();
            
            return { user, profile };
        }
        return { user: null, profile: null };
    } catch (error) {
        console.error('Error getting current user:', error);
        return { user: null, profile: null };
    }
}

// ==================== PATIENTS FUNCTIONS ====================

async function loadPatientsFromDB() {
    try {
        const { data, error } = await supabaseClient
            .from('pacientes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error loading patients:', error);
        return { success: false, error: error.message, data: [] };
    }
}

async function savePatientToDB(patientData) {
    try {
        const { data, error } = await supabaseClient
            .from('pacientes')
            .insert([{
                nombre: patientData.name,
                cedula: patientData.cedula,
                edad: patientData.age,
                genero: patientData.gender,
                telefono: patientData.phone,
                direccion: patientData.address,
                alergias: patientData.allergies ? patientData.allergies.split(',').map(a => a.trim()) : [],
                condiciones_cronicas: patientData.conditions ? patientData.conditions.split(',').map(c => c.trim()) : [],
                medicamentos: patientData.medications ? patientData.medications.split(',').map(m => m.trim()) : [],
                tipo_sangre: patientData.bloodType,
                seguro_medico: patientData.insurance || null,
                numero_seguro: patientData.insuranceNumber || null
            }])
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error saving patient:', error);
        return { success: false, error: error.message };
    }
}

async function updatePatientInDB(patientId, patientData) {
    try {
        const { data, error } = await supabaseClient
            .from('pacientes')
            .update({
                nombre: patientData.name,
                cedula: patientData.cedula,
                edad: patientData.age,
                genero: patientData.gender,
                telefono: patientData.phone,
                direccion: patientData.address,
                alergias: patientData.allergies ? patientData.allergies.split(',').map(a => a.trim()) : [],
                condiciones_cronicas: patientData.conditions ? patientData.conditions.split(',').map(c => c.trim()) : [],
                medicamentos: patientData.medications ? patientData.medications.split(',').map(m => m.trim()) : [],
                tipo_sangre: patientData.bloodType,
                seguro_medico: patientData.insurance || null,
                numero_seguro: patientData.insuranceNumber || null,
                updated_at: new Date()
            })
            .eq('id', patientId)
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error updating patient:', error);
        return { success: false, error: error.message };
    }
}

async function deletePatientFromDB(patientId) {
    try {
        const { error } = await supabaseClient
            .from('pacientes')
            .delete()
            .eq('id', patientId);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting patient:', error);
        return { success: false, error: error.message };
    }
}

// ==================== APPOINTMENTS FUNCTIONS ====================

async function loadAppointmentsFromDB() {
    try {
        const { data, error } = await supabaseClient
            .from('citas')
            .select(`
                *,
                pacientes:paciente_id (id, nombre, cedula, telefono),
                medicos:medico_id (id, nombre, especialidad)
            `)
            .order('fecha', { ascending: true })
            .order('hora', { ascending: true });
        
        if (error) throw error;
        
        // Transform data to match frontend format
        const transformedData = (data || []).map(apt => ({
            id: apt.id,
            patientId: apt.paciente_id,
            patientName: apt.pacientes?.nombre || 'Paciente',
            patientCedula: apt.pacientes?.cedula,
            doctorId: apt.medico_id,
            doctor: apt.medicos?.nombre || 'Médico',
            doctorSpecialty: apt.medicos?.especialidad,
            date: apt.fecha,
            time: apt.hora,
            type: apt.tipo,
            status: apt.estado,
            notes: apt.notas
        }));
        
        return { success: true, data: transformedData };
    } catch (error) {
        console.error('Error loading appointments:', error);
        return { success: false, error: error.message, data: [] };
    }
}

async function saveAppointmentToDB(appointmentData) {
    try {
        const { data, error } = await supabaseClient
            .from('citas')
            .insert([{
                paciente_id: appointmentData.patientId,
                medico_id: appointmentData.doctorId,
                fecha: appointmentData.date,
                hora: appointmentData.time,
                tipo: appointmentData.type,
                estado: appointmentData.status || 'pendiente',
                notas: appointmentData.notes || null
            }])
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error saving appointment:', error);
        return { success: false, error: error.message };
    }
}

async function updateAppointmentStatus(appointmentId, status) {
    try {
        const { data, error } = await supabaseClient
            .from('citas')
            .update({
                estado: status,
                updated_at: new Date()
            })
            .eq('id', appointmentId)
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error updating appointment status:', error);
        return { success: false, error: error.message };
    }
}

// ==================== DOCTORS FUNCTIONS ====================

async function loadDoctorsFromDB() {
    try {
        console.log('Fetching doctors from Supabase...');
        
        const { data, error } = await supabaseClient
            .from('medicos')
            .select('*')
            .order('nombre', { ascending: true });
        
        if (error) {
            console.error('Supabase error loading doctors:', error);
            return { success: false, error: error.message, data: [] };
        }
        
        console.log('Raw doctors data from Supabase:', data);
        
        const transformedData = (data || []).map(doc => ({
            id: doc.id,
            name: doc.nombre,
            cedula: doc.cedula,
            specialty: doc.especialidad,
            phone: doc.telefono
        }));
        
        console.log('Transformed doctors data:', transformedData);
        
        return { success: true, data: transformedData };
    } catch (error) {
        console.error('Exception loading doctors:', error);
        return { success: false, error: error.message, data: [] };
    }
}
// ==================== INVOICES FUNCTIONS ====================

async function loadInvoicesFromDB() {
    try {
        const { data, error } = await supabaseClient
            .from('facturas')
            .select(`
                *,
                pacientes:paciente_id (id, nombre, cedula)
            `)
            .order('fecha', { ascending: false });
        
        if (error) throw error;
        
        const transformedData = (data || []).map(inv => ({
            id: inv.id,
            invoiceNumber: inv.numero_factura,
            patientId: inv.paciente_id,
            patientName: inv.pacientes?.nombre || 'Paciente',
            date: inv.fecha,
            amount: inv.monto_total,
            status: inv.estado,
            insurance: inv.ars
        }));
        
        return { success: true, data: transformedData };
    } catch (error) {
        console.error('Error loading invoices:', error);
        return { success: false, error: error.message, data: [] };
    }
}

async function saveInvoiceToDB(invoiceData, items) {
    try {
        // Generate invoice number
        const invoiceNumber = `FAC-${new Date().getFullYear()}-${Date.now()}`;
        
        // Insert invoice
        const { data: invoice, error: invoiceError } = await supabaseClient
            .from('facturas')
            .insert([{
                numero_factura: invoiceNumber,
                paciente_id: invoiceData.patientId,
                fecha: invoiceData.date,
                monto_total: invoiceData.total,
                estado: 'pendiente',
                ars: invoiceData.insurance || null
            }])
            .select();
        
        if (invoiceError) throw invoiceError;
        
        // Insert invoice items
        if (items && items.length > 0) {
            const itemsToInsert = items.map(item => ({
                factura_id: invoice[0].id,
                descripcion: item.description,
                precio: item.price
            }));
            
            const { error: itemsError } = await supabaseClient
                .from('items_factura')
                .insert(itemsToInsert);
            
            if (itemsError) throw itemsError;
        }
        
        return { success: true, data: invoice[0] };
    } catch (error) {
        console.error('Error saving invoice:', error);
        return { success: false, error: error.message };
    }
}

async function updateInvoiceStatus(invoiceId, status) {
    try {
        const { data, error } = await supabaseClient
            .from('facturas')
            .update({
                estado: status,
                updated_at: new Date()
            })
            .eq('id', invoiceId)
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error updating invoice status:', error);
        return { success: false, error: error.message };
    }
}

// ==================== PAYMENTS FUNCTIONS ====================

async function loadPaymentsFromDB() {
    try {
        const { data, error } = await supabaseClient
            .from('pagos')
            .select(`
                *,
                facturas:factura_id (numero_factura),
                pacientes:paciente_id (id, nombre)
            `)
            .order('fecha', { ascending: false });
        
        if (error) throw error;
        
        const transformedData = (data || []).map(payment => ({
            id: payment.numero_pago,
            paymentId: payment.id,
            invoiceId: payment.facturas?.numero_factura || payment.factura_id,
            patientId: payment.paciente_id,
            patientName: payment.pacientes?.nombre || 'Paciente',
            amount: payment.monto,
            method: payment.metodo,
            date: payment.fecha
        }));
        
        return { success: true, data: transformedData };
    } catch (error) {
        console.error('Error loading payments:', error);
        return { success: false, error: error.message, data: [] };
    }
}

async function savePaymentToDB(paymentData) {
    try {
        const paymentNumber = `PAG-${new Date().getFullYear()}-${Date.now()}`;
        
        const { data, error } = await supabaseClient
            .from('pagos')
            .insert([{
                numero_pago: paymentNumber,
                factura_id: paymentData.invoiceId,
                paciente_id: paymentData.patientId,
                monto: paymentData.amount,
                metodo: paymentData.method,
                fecha: paymentData.date
            }])
            .select();
        
        if (error) throw error;
        
        // Update invoice status to paid
        await updateInvoiceStatus(paymentData.invoiceId, 'pagado');
        
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error saving payment:', error);
        return { success: false, error: error.message };
    }
}

// ==================== SERVICES FUNCTIONS ====================

// Note: Services are stored in a separate table. You may need to create this table.
// If not, we'll use a default list
const defaultServices = [
    { id: '1', name: 'Consulta General', description: 'Consulta médica estándar', price: 1500 },
    { id: '2', name: 'Consulta Especializada', description: 'Consulta con especialista', price: 2500 },
    { id: '3', name: 'Análisis de Sangre', description: 'Examen de laboratorio completo', price: 1200 },
    { id: '4', name: 'Radiografía', description: 'Estudio radiológico', price: 800 },
    { id: '5', name: 'Ecografía', description: 'Estudio ecográfico', price: 2000 }
];

async function loadServicesFromDB() {
    try {
        // Try to get from database first
        const { data, error } = await supabaseClient
            .from('servicios')
            .select('*')
            .order('nombre', { ascending: true });
        
        if (error && error.code !== '42P01') { // Table doesn't exist error
            console.error('Error loading services:', error);
            return { success: true, data: defaultServices };
        }
        
        if (data && data.length > 0) {
            const transformedData = data.map(s => ({
                id: s.id,
                name: s.nombre,
                description: s.descripcion,
                price: s.precio
            }));
            return { success: true, data: transformedData };
        }
        
        return { success: true, data: defaultServices };
    } catch (error) {
        console.error('Error loading services:', error);
        return { success: true, data: defaultServices };
    }
}

async function saveServiceToDB(serviceData) {
    try {
        const { data, error } = await supabaseClient
            .from('servicios')
            .insert([{
                nombre: serviceData.name,
                descripcion: serviceData.description,
                precio: serviceData.price
            }])
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error saving service:', error);
        return { success: false, error: error.message };
    }
}

// ==================== STATS FUNCTIONS ====================

async function loadMonthlyRevenue() {
    try {
        const currentDate = new Date();
        const months = [];
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            // Obtener el último día del mes correctamente
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            
            months.push({
                month: date.toLocaleDateString('es-ES', { month: 'short' }),
                year: date.getFullYear(),
                monthNum: date.getMonth() + 1,
                lastDay: lastDay
            });
        }
        
        const monthlyData = [];
        
        for (const month of months) {
            const startDate = `${month.year}-${String(month.monthNum).padStart(2, '0')}-01`;
            const endDate = `${month.year}-${String(month.monthNum).padStart(2, '0')}-${month.lastDay}`;
            
            console.log(`Querying revenue for ${month.month}: ${startDate} to ${endDate}`);
            
            const { data, error } = await supabaseClient
                .from('facturas')
                .select('monto_total')
                .eq('estado', 'pagado')
                .gte('fecha', startDate)
                .lte('fecha', endDate);
            
            if (error) {
                console.error(`Error loading revenue for ${month.month}:`, error);
                monthlyData.push({ month: month.month, revenue: 0 });
            } else {
                const total = (data || []).reduce((sum, inv) => sum + inv.monto_total, 0);
                monthlyData.push({ month: month.month, revenue: total });
                console.log(`Revenue for ${month.month}: RD$ ${total}`);
            }
        }
        
        return { success: true, data: monthlyData };
    } catch (error) {
        console.error('Error calculating monthly revenue:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// ==================== ARS (INSURANCE) FUNCTIONS ====================

async function loadARSList() {
    try {
        const { data, error } = await supabaseClient
            .from('ars')
            .select('*')
            .order('nombre', { ascending: true });
        
        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error loading ARS list:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// ==================== SESSION MANAGEMENT ====================

async function checkAuthSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session !== null;
}

// Listen for auth changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in');
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'index.html';
        }
    }
});
