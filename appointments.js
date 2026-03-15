// ==================== APPOINTMENTS MODULE ====================

let selectedDate = new Date().toISOString().split('T')[0];

function loadAppointmentsModule() {
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
                            <!-- Appointments will be rendered here -->
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
                            <label>Paciente</label>
                            <select required>
                                <option value="">Selecciona un paciente</option>
                                ${patientsData.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Fecha</label>
                                <input type="date" required>
                            </div>
                            <div class="form-group">
                                <label>Hora</label>
                                <input type="time" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Tipo de Consulta</label>
                            <select required>
                                <option value="">Selecciona tipo de consulta</option>
                                <option value="general">Consulta General</option>
                                <option value="revision">Revisión</option>
                                <option value="primera">Primera Consulta</option>
                                <option value="urgencia">Urgencia</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Médico</label>
                            <select required>
                                <option value="">Asignar médico</option>
                                ${doctorsData.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('newAppointmentModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="saveNewAppointment()">Agendar Cita</button>
                </div>
            </div>
        </div>
    `;
    
    moduleContent.innerHTML = html;
    updateAppointmentStats();
    renderAppointmentsList();
}

function updateAppointmentStats() {
    const total = appointmentsData.length;
    const confirmed = appointmentsData.filter(a => a.status === 'confirmada').length;
    const pending = appointmentsData.filter(a => a.status === 'pendiente').length;
    const completed = appointmentsData.filter(a => a.status === 'completada').length;
    
    document.getElementById('totalAppointments').textContent = total;
    document.getElementById('confirmedAppointments').textContent = confirmed;
    document.getElementById('pendingAppointments').textContent = pending;
    document.getElementById('completedAppointments').textContent = completed;
}

function renderAppointmentsList() {
    const container = document.getElementById('appointmentsList');
    const todayAppointments = appointmentsData.filter(apt => apt.date === selectedDate);
    
    document.getElementById('appointmentsDateTitle').textContent = `Citas del ${formatDateLong(selectedDate)}`;
    document.getElementById('appointmentsCount').textContent = 
        `${todayAppointments.length} ${todayAppointments.length === 1 ? 'cita programada' : 'citas programadas'}`;
    
    document.getElementById('todayCount').textContent = todayAppointments.length;
    document.getElementById('availableSlots').textContent = 
        `${Math.max(0, 10 - todayAppointments.length)} slots`;
    
    if (todayAppointments.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem; color: var(--gray-500);">
                ${icons.calendar}
                <p style="margin-top: 0.75rem;">No hay citas programadas para este día</p>
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
                    <h4 class="font-semibold">${apt.patientName}</h4>
                    ${createStatusBadge(apt.status)}
                </div>
                <div class="text-sm" style="color: var(--gray-600);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                        ${icons.user}
                        <span>${apt.doctor}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        ${icons.alertCircle}
                        <span>${apt.type}</span>
                    </div>
                </div>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-outline btn-sm">Editar</button>
                ${apt.status === 'pendiente' ? `
                    <button class="btn btn-success btn-sm" onclick="confirmAppointment('${apt.id}')">Confirmar</button>
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
    showModal('newAppointmentModal');
}

function saveNewAppointment() {
    // In a real app, this would save to database
    alert('Funcionalidad de guardado no implementada en esta demo');
    hideModal('newAppointmentModal');
}

function confirmAppointment(appointmentId) {
    const appointment = appointmentsData.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = 'confirmada';
        updateAppointmentStats();
        renderAppointmentsList();
    }
}
