// ==================== APPOINTMENTS MODULE ====================

let selectedDate = new Date().toISOString().split('T')[0];
let appointmentsList = [];
let patientsListForAppointments = [];
let doctorsList = [];

function loadAppointmentsModule() {
    console.log('=== CARGANDO MÓDULO DE CITAS ===');
    console.log('Fecha seleccionada:', selectedDate);
    
    const html = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-3xl font-semibold">Agenda y Citas</h2>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">Gestiona las citas de tus pacientes</p>
                </div>
                <button class="btn btn-primary" onclick="openNewAppointmentModal()">
                    ${icons.plus}
                    Nueva Cita
                </button>
            </div>

            <!-- Stats -->
            <div class="stats-grid">
                <div class="card">
                    <div class="card-content">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h3>Total Citas</h3>
                                <p class="stat-value" id="totalAppointments">0</p>
                            </div>
                            <div class="stat-icon">${icons.calendar}</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h3>Confirmadas</h3>
                                <p class="stat-value text-success" id="confirmedAppointments">0</p>
                            </div>
                            <div class="stat-icon" style="color: var(--success-color);">${icons.checkCircle}</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h3>Pendientes</h3>
                                <p class="stat-value text-warning" id="pendingAppointments">0</p>
                            </div>
                            <div class="stat-icon" style="color: var(--warning-color);">${icons.clock}</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h3>Completadas</h3>
                                <p class="stat-value" style="color: var(--primary-color);" id="completedAppointments">0</p>
                            </div>
                            <div class="stat-icon" style="color: var(--primary-color);">${icons.checkCircle}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Calendar and Appointments -->
            <div class="grid" style="grid-template-columns: 1fr 2fr; gap: 1.5rem;">
                <!-- Calendar Card -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Calendario</h3>
                        <p class="card-description">Selecciona una fecha</p>
                    </div>
                    <div class="card-content">
                        <input 
                            type="date" 
                            id="calendarDate" 
                            value="${selectedDate}"
                            onchange="changeDate(this.value)"
                            style="width: 100%; padding: 0.625rem; border: 1px solid var(--gray-300); border-radius: var(--border-radius);"
                        >
                        <div class="mt-4" style="padding: 0.75rem; background-color: #dbeafe; border-radius: var(--border-radius);">
                            <p class="text-sm font-medium" style="color: var(--primary-color); margin-bottom: 0.5rem;">
                                Ocupación del día
                            </p>
                            <div class="text-sm" style="color: var(--primary-color);">
                                <div class="flex justify-between mb-2">
                                    <span>Citas programadas:</span>
                                    <span class="font-semibold" id="todayCount">0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Disponibilidad:</span>
                                    <span class="font-semibold" id="availableSlots">10 slots</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Appointments List -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title" id="appointmentsDateTitle">Citas del día</h3>
                        <p class="card-description" id="appointmentsCount">0 citas programadas</p>
                    </div>
                    <div class="card-content">
                        <div id="appointmentsList" class="space-y-4">
                            <div class="text-center" style="padding: 3rem;">
                                <div class="loading-spinner"></div>
                                <p style="margin-top: 1rem; color: var(--gray-600);">Cargando citas...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Appointment Modal -->
        <div id="newAppointmentModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Programar Nueva Cita</h3>
                    <p class="modal-description">Completa la información para agendar una cita</p>
                </div>
                <div class="modal-body">
                    <form id="newAppointmentForm" class="space-y-4">
                        <div class="form-group">
                            <label>Paciente *</label>
                            <select id="appointmentPatientId" required>
                                <option value="">Selecciona un paciente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Médico *</label>
                            <select id="appointmentDoctorId" required>
                                <option value="">Asignar médico</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Fecha *</label>
                                <input type="date" id="appointmentDate" required>
                            </div>
                            <div class="form-group">
                                <label>Hora *</label>
                                <input type="time" id="appointmentTime" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Tipo de Consulta</label>
                            <select id="appointmentType">
                                <option value="Consulta General">Consulta General</option>
                                <option value="Revisión">Revisión</option>
                                <option value="Primera Consulta">Primera Consulta</option>
                                <option value="Emergencia">Emergencia</option>
                                <option value="Control">Control</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Notas (opcional)</label>
                            <textarea id="appointmentNotes" placeholder="Notas adicionales sobre la cita" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('newAppointmentModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="saveNewAppointment()">Agendar Cita</button>
                </div>
            </div>
        </div>

        <!-- Edit Appointment Modal -->
        <div id="editAppointmentModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Editar Cita</h3>
                    <p class="modal-description">Modifica la información de la cita</p>
                </div>
                <div class="modal-body">
                    <form id="editAppointmentForm" class="space-y-4">
                        <input type="hidden" id="editAppointmentId">
                        <div class="form-group">
                            <label>Paciente *</label>
                            <select id="editAppointmentPatientId" required>
                                <option value="">Selecciona un paciente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Médico *</label>
                            <select id="editAppointmentDoctorId" required>
                                <option value="">Asignar médico</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Fecha *</label>
                                <input type="date" id="editAppointmentDate" required>
                            </div>
                            <div class="form-group">
                                <label>Hora *</label>
                                <input type="time" id="editAppointmentTime" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Tipo de Consulta</label>
                            <select id="editAppointmentType">
                                <option value="Consulta General">Consulta General</option>
                                <option value="Revisión">Revisión</option>
                                <option value="Primera Consulta">Primera Consulta</option>
                                <option value="Emergencia">Emergencia</option>
                                <option value="Control">Control</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Estado</label>
                            <select id="editAppointmentStatus">
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="completada">Completada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Notas</label>
                            <textarea id="editAppointmentNotes" placeholder="Notas adicionales sobre la cita" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('editAppointmentModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="updateAppointment()">Actualizar Cita</button>
                    <button class="btn btn-danger" onclick="cancelAppointment()">Cancelar Cita</button>
                </div>
            </div>
        </div>
    `;
    
    moduleContent.innerHTML = html;
    console.log('Llamando a loadAppointments()...');
    loadAppointments();
    console.log('Llamando a loadPatientsForAppointments()...');

    loadPatientsForAppointments();
    console.log('Llamando a loadDoctors()...');
    loadDoctors();

        console.log('=== MÓDULO DE CITAS CARGADO ===');
}

async function loadAppointments() {
    const result = await loadAppointmentsFromDB();
    
    if (result.success) {
        appointmentsList = result.data;
        updateAppointmentStats();
        renderAppointmentsList();
    } else {
        const container = document.getElementById('appointmentsList');
        if (container) {
            showError('appointmentsList', 'Error al cargar citas: ' + result.error);
        }
    }
}

async function loadPatientsForAppointments() {
    const result = await loadPatientsFromDB();
    
    if (result.success) {
        patientsListForAppointments = result.data;
        
        const patientOptions = patientsListForAppointments.map(p => 
            `<option value="${p.id}">${escapeHtml(p.nombre)} - ${p.cedula || ''}</option>`
        ).join('');
        
        const newPatientSelect = document.getElementById('appointmentPatientId');
        const editPatientSelect = document.getElementById('editAppointmentPatientId');
        
        if (newPatientSelect) {
            newPatientSelect.innerHTML = '<option value="">Selecciona un paciente</option>' + patientOptions;
        }
        if (editPatientSelect) {
            editPatientSelect.innerHTML = '<option value="">Selecciona un paciente</option>' + patientOptions;
        }
    }
}

async function loadDoctors() {
    console.log('=== INICIANDO CARGA DE MÉDICOS ===');
    console.log('1. Llamando a loadDoctorsFromDB()...');
    
    const result = await loadDoctorsFromDB();
    
    console.log('2. Resultado de loadDoctorsFromDB:', result);
    
    if (result.success) {
        doctorsList = result.data;
        console.log('3. Médicos cargados exitosamente. Cantidad:', doctorsList.length);
        console.log('4. Datos de médicos:', doctorsList);
        
        const doctorOptions = doctorsList.map(d => 
            `<option value="${d.id}">${escapeHtml(d.name)} - ${d.specialty || 'General'}</option>`
        ).join('');
        
        console.log('5. Opciones generadas:', doctorOptions);
        
        const newDoctorSelect = document.getElementById('appointmentDoctorId');
        const editDoctorSelect = document.getElementById('editAppointmentDoctorId');
        
        console.log('6. Elementos select encontrados:', {
            'appointmentDoctorId': !!newDoctorSelect,
            'editAppointmentDoctorId': !!editDoctorSelect
        });
        
        if (newDoctorSelect) {
            newDoctorSelect.innerHTML = '<option value="">Seleccionar médico</option>' + doctorOptions;
            console.log('7. Select de médicos actualizado. Total opciones:', newDoctorSelect.options.length);
        } else {
            console.error('7. ERROR: No se encontró el elemento con id "appointmentDoctorId"');
        }
        
        if (editDoctorSelect) {
            editDoctorSelect.innerHTML = '<option value="">Seleccionar médico</option>' + doctorOptions;
        }
    } else {
        console.error('ERROR al cargar médicos:', result.error);
        const newDoctorSelect = document.getElementById('appointmentDoctorId');
        if (newDoctorSelect) {
            newDoctorSelect.innerHTML = '<option value="">Error al cargar médicos: ' + result.error + '</option>';
        }
    }
    
    console.log('=== FIN CARGA DE MÉDICOS ===');
}

function updateAppointmentStats() {
    const total = appointmentsList.length;
    const confirmed = appointmentsList.filter(a => a.status === 'confirmada').length;
    const pending = appointmentsList.filter(a => a.status === 'pendiente').length;
    const completed = appointmentsList.filter(a => a.status === 'completada').length;
    
    const totalEl = document.getElementById('totalAppointments');
    const confirmedEl = document.getElementById('confirmedAppointments');
    const pendingEl = document.getElementById('pendingAppointments');
    const completedEl = document.getElementById('completedAppointments');
    
    if (totalEl) totalEl.textContent = total;
    if (confirmedEl) confirmedEl.textContent = confirmed;
    if (pendingEl) pendingEl.textContent = pending;
    if (completedEl) completedEl.textContent = completed;
}

function renderAppointmentsList() {
    const container = document.getElementById('appointmentsList');
    if (!container) return;
    
    const todayAppointments = appointmentsList.filter(apt => apt.date === selectedDate);
    
    const dateTitleEl = document.getElementById('appointmentsDateTitle');
    const countEl = document.getElementById('appointmentsCount');
    const todayCountEl = document.getElementById('todayCount');
    const availableSlotsEl = document.getElementById('availableSlots');
    
    if (dateTitleEl) dateTitleEl.textContent = `Citas del ${formatDateLong(selectedDate)}`;
    if (countEl) countEl.textContent = `${todayAppointments.length} ${todayAppointments.length === 1 ? 'cita programada' : 'citas programadas'}`;
    if (todayCountEl) todayCountEl.textContent = todayAppointments.length;
    if (availableSlotsEl) availableSlotsEl.textContent = `${Math.max(0, 10 - todayAppointments.length)} slots`;
    
    if (todayAppointments.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem; color: var(--gray-500);">
                ${icons.calendar}
                <p style="margin-top: 0.75rem;">No hay citas programadas para este día</p>
                <button class="btn btn-outline mt-4" onclick="openNewAppointmentModal()">Agendar Cita</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todayAppointments.map(apt => `
        <div class="appointment-card">
            <div class="appointment-time">
                <span class="appointment-time-text">${apt.time}</span>
            </div>
            <div class="appointment-details">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <h4 class="font-semibold">${escapeHtml(apt.patientName)}</h4>
                    ${createStatusBadge(apt.status)}
                </div>
                <div class="text-sm" style="color: var(--gray-600);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                        ${icons.user}
                        <span>Dr. ${escapeHtml(apt.doctor)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        ${icons.alertCircle}
                        <span>${escapeHtml(apt.type || 'Consulta General')}</span>
                    </div>
                </div>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-outline btn-sm" onclick="editAppointment('${apt.id}')">Editar</button>
                ${apt.status === 'pendiente' ? `
                    <button class="btn btn-success btn-sm" onclick="confirmAppointment('${apt.id}')">Confirmar</button>
                ` : ''}
                ${apt.status === 'confirmada' ? `
                    <button class="btn btn-secondary btn-sm" onclick="completeAppointment('${apt.id}')">Completar</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function changeDate(newDate) {
    selectedDate = newDate;
    renderAppointmentsList();
}

function openNewAppointmentModal() {
    // Set default date to selected date
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.value = selectedDate;
    }
    showModal('newAppointmentModal');
}

async function saveNewAppointment() {
    const appointmentData = {
        patientId: document.getElementById('appointmentPatientId').value,
        doctorId: document.getElementById('appointmentDoctorId').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        type: document.getElementById('appointmentType').value,
        notes: document.getElementById('appointmentNotes').value,
        status: 'pendiente'
    };
    
    // Validate required fields
    if (!appointmentData.patientId || !appointmentData.doctorId || !appointmentData.date || !appointmentData.time) {
        alert('Por favor complete todos los campos requeridos');
        return;
    }
    
    const result = await saveAppointmentToDB(appointmentData);
    
    if (result.success) {
        showNotification('Cita agendada exitosamente');
        hideModal('newAppointmentModal');
        await loadAppointments();
    } else {
        alert('Error al guardar cita: ' + result.error);
    }
}

async function editAppointment(appointmentId) {
    const appointment = appointmentsList.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    // Fill edit form
    document.getElementById('editAppointmentId').value = appointment.id;
    document.getElementById('editAppointmentPatientId').value = appointment.patientId || '';
    document.getElementById('editAppointmentDoctorId').value = appointment.doctorId || '';
    document.getElementById('editAppointmentDate').value = appointment.date;
    document.getElementById('editAppointmentTime').value = appointment.time;
    document.getElementById('editAppointmentType').value = appointment.type || 'Consulta General';
    document.getElementById('editAppointmentStatus').value = appointment.status;
    document.getElementById('editAppointmentNotes').value = appointment.notes || '';
    
    showModal('editAppointmentModal');
}

async function updateAppointment() {
    const appointmentId = document.getElementById('editAppointmentId').value;
    
    const appointmentData = {
        patientId: document.getElementById('editAppointmentPatientId').value,
        doctorId: document.getElementById('editAppointmentDoctorId').value,
        date: document.getElementById('editAppointmentDate').value,
        time: document.getElementById('editAppointmentTime').value,
        type: document.getElementById('editAppointmentType').value,
        status: document.getElementById('editAppointmentStatus').value,
        notes: document.getElementById('editAppointmentNotes').value
    };
    
    // Validate required fields
    if (!appointmentData.patientId || !appointmentData.doctorId || !appointmentData.date || !appointmentData.time) {
        alert('Por favor complete todos los campos requeridos');
        return;
    }
    
    const result = await updateAppointmentStatus(appointmentId, appointmentData.status);
    
    if (result.success) {
        showNotification('Cita actualizada exitosamente');
        hideModal('editAppointmentModal');
        await loadAppointments();
    } else {
        alert('Error al actualizar cita: ' + result.error);
    }
}

async function confirmAppointment(appointmentId) {
    const result = await updateAppointmentStatus(appointmentId, 'confirmada');
    
    if (result.success) {
        showNotification('Cita confirmada exitosamente');
        await loadAppointments();
    } else {
        alert('Error al confirmar cita: ' + result.error);
    }
}

async function completeAppointment(appointmentId) {
    const result = await updateAppointmentStatus(appointmentId, 'completada');
    
    if (result.success) {
        showNotification('Cita marcada como completada');
        await loadAppointments();
    } else {
        alert('Error al completar cita: ' + result.error);
    }
}

async function cancelAppointment() {
    const appointmentId = document.getElementById('editAppointmentId').value;
    
    const confirmed = confirm('¿Está seguro de cancelar esta cita?');
    
    if (confirmed) {
        const result = await updateAppointmentStatus(appointmentId, 'cancelada');
        
        if (result.success) {
            showNotification('Cita cancelada');
            hideModal('editAppointmentModal');
            await loadAppointments();
        } else {
            alert('Error al cancelar cita: ' + result.error);
        }
    }
}
