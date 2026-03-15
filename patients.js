// ==================== PATIENTS MODULE ====================

let selectedPatient = null;
let patientSearchQuery = '';

function loadPatientsModule() {
    const html = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-3xl font-semibold">Gestión de Pacientes</h2>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">Administra la información de tus pacientes</p>
                </div>
                <button class="btn btn-primary" onclick="openNewPatientModal()">
                    ${icons.plus}
                    Nuevo Paciente
                </button>
            </div>

            <!-- Search -->
            <div class="card">
                <div class="card-content">
                    <div class="search-container" style="margin-bottom: 0;">
                        <span class="search-icon">${icons.search}</span>
                        <input 
                            type="text" 
                            class="search-input" 
                            placeholder="Buscar por nombre o email..." 
                            id="patientSearch"
                            onkeyup="filterPatients()"
                        >
                    </div>
                </div>
            </div>

            <!-- Patient List -->
            <div id="patientList" class="space-y-4">
                <!-- Patient cards will be rendered here -->
            </div>
        </div>

        <!-- New Patient Modal -->
        <div id="newPatientModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Registrar Nuevo Paciente</h3>
                    <p class="modal-description">Completa la información del nuevo paciente</p>
                </div>
                <div class="modal-body">
                    <form id="newPatientForm" class="space-y-4">
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Nombre Completo</label>
                                <input type="text" placeholder="Nombre del paciente" required>
                            </div>
                            <div class="form-group">
                                <label>Edad</label>
                                <input type="number" placeholder="Edad" required>
                            </div>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="email@ejemplo.com" required>
                            </div>
                            <div class="form-group">
                                <label>Teléfono</label>
                                <input type="tel" placeholder="+34 600 000 000" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Dirección</label>
                            <input type="text" placeholder="Dirección completa" required>
                        </div>
                        <div class="form-group">
                            <label>Alergias</label>
                            <textarea placeholder="Lista de alergias conocidas"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('newPatientModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="saveNewPatient()">Guardar Paciente</button>
                </div>
            </div>
        </div>

        <!-- Patient Detail Modal -->
        <div id="patientDetailModal" class="modal-overlay">
            <div class="modal" style="max-width: 800px;">
                <div class="modal-header">
                    <h3 class="modal-title" id="patientDetailName">Paciente</h3>
                    <p class="modal-description">Ficha clínica completa del paciente</p>
                </div>
                <div class="modal-body">
                    <!-- Tabs -->
                    <div class="tabs">
                        <div class="tabs-list">
                            <button class="tab-trigger active" onclick="switchPatientTab('info')">Información</button>
                            <button class="tab-trigger" onclick="switchPatientTab('medical')">Historial Médico</button>
                            <button class="tab-trigger" onclick="switchPatientTab('medications')">Medicamentos</button>
                            <button class="tab-trigger" onclick="switchPatientTab('documents')">Documentos</button>
                        </div>
                        
                        <!-- Info Tab -->
                        <div id="tab-info" class="tab-content active">
                            <div id="patientInfoContent" class="grid grid-cols-2"></div>
                        </div>
                        
                        <!-- Medical Tab -->
                        <div id="tab-medical" class="tab-content space-y-4">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title text-lg">Alergias</h4>
                                </div>
                                <div class="card-content">
                                    <div id="allergiesList"></div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title text-lg">Condiciones Crónicas</h4>
                                </div>
                                <div class="card-content">
                                    <div id="conditionsList"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Medications Tab -->
                        <div id="tab-medications" class="tab-content">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title text-lg">Medicamentos Actuales</h4>
                                </div>
                                <div class="card-content">
                                    <div id="medicationsList"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Documents Tab -->
                        <div id="tab-documents" class="tab-content">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title text-lg">Documentos y Archivos</h4>
                                    <p class="card-description">Subir estudios, análisis e imágenes médicas</p>
                                </div>
                                <div class="card-content">
                                    <div style="border: 2px dashed var(--gray-300); border-radius: var(--border-radius); padding: 2rem; text-align: center;">
                                        <p style="color: var(--gray-600);">Arrastra archivos aquí o haz clic para seleccionar</p>
                                        <button class="btn btn-outline mt-4">Seleccionar Archivos</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('patientDetailModal')">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    moduleContent.innerHTML = html;
    renderPatientList();
}

function renderPatientList() {
    const container = document.getElementById('patientList');
    const filtered = patientsData.filter(patient => 
        patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(patientSearchQuery.toLowerCase())
    );
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--gray-500); padding: 2rem;">No se encontraron pacientes</p>';
        return;
    }
    
    container.innerHTML = filtered.map(patient => `
        <div class="patient-card" onclick="openPatientDetail('${patient.id}')">
            <div class="patient-header">
                <h3 class="text-lg font-semibold">${patient.name}</h3>
                <span class="badge badge-secondary">${patient.bloodType}</span>
                <span class="badge badge-secondary">${patient.age} años</span>
            </div>
            <div class="patient-info-grid">
                <div>
                    <p><span class="font-medium">Email:</span> ${patient.email}</p>
                    <p><span class="font-medium">Teléfono:</span> ${patient.phone}</p>
                </div>
                <div>
                    <p><span class="font-medium">Género:</span> ${patient.gender}</p>
                    <p><span class="font-medium">Dirección:</span> ${patient.address}</p>
                </div>
            </div>
            ${(patient.allergies.length > 0 || patient.chronicConditions.length > 0) ? `
                <div class="patient-alerts">
                    ${patient.allergies.length > 0 ? `
                        <div class="alert-item alert-danger">
                            ${icons.alertCircle}
                            <span class="font-medium">${patient.allergies.join(', ')}</span>
                        </div>
                    ` : ''}
                    ${patient.chronicConditions.length > 0 ? `
                        <div class="alert-item alert-warning">
                            ${icons.fileText}
                            <span class="font-medium">${patient.chronicConditions.join(', ')}</span>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function filterPatients() {
    patientSearchQuery = document.getElementById('patientSearch').value;
    renderPatientList();
}

function openNewPatientModal() {
    showModal('newPatientModal');
}

function saveNewPatient() {
    // In a real app, this would save to database
    alert('Funcionalidad de guardado no implementada en esta demo');
    hideModal('newPatientModal');
}

function openPatientDetail(patientId) {
    selectedPatient = patientsData.find(p => p.id === patientId);
    if (!selectedPatient) return;
    
    // Update modal content
    document.getElementById('patientDetailName').textContent = selectedPatient.name;
    
    // Info tab
    document.getElementById('patientInfoContent').innerHTML = `
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Nombre Completo</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.name}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Edad</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.age} años</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Género</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.gender}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Tipo de Sangre</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.bloodType}</p>
        </div>
        <div style="grid-column: span 2;">
            <label style="color: var(--gray-600); font-size: 0.875rem;">Email</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.email}</p>
        </div>
        <div style="grid-column: span 2;">
            <label style="color: var(--gray-600); font-size: 0.875rem;">Teléfono</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.phone}</p>
        </div>
        <div style="grid-column: span 2;">
            <label style="color: var(--gray-600); font-size: 0.875rem;">Dirección</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.address}</p>
        </div>
    `;
    
    // Allergies
    document.getElementById('allergiesList').innerHTML = selectedPatient.allergies.length > 0 
        ? selectedPatient.allergies.map(a => `<span class="badge badge-danger" style="margin-right: 0.5rem;">${a}</span>`).join('')
        : '<p style="color: var(--gray-500);">Sin alergias registradas</p>';
    
    // Conditions
    document.getElementById('conditionsList').innerHTML = selectedPatient.chronicConditions.length > 0
        ? selectedPatient.chronicConditions.map(c => `<span class="badge badge-outline" style="margin-right: 0.5rem;">${c}</span>`).join('')
        : '<p style="color: var(--gray-500);">Sin condiciones crónicas registradas</p>';
    
    // Medications
    document.getElementById('medicationsList').innerHTML = selectedPatient.medications.length > 0
        ? selectedPatient.medications.map(m => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background-color: #dbeafe; border-radius: var(--border-radius); margin-bottom: 0.5rem;">
                <span class="font-medium">${m}</span>
                <span class="badge badge-success">Activo</span>
            </div>
        `).join('')
        : '<p style="color: var(--gray-500);">Sin medicamentos registrados</p>';
    
    showModal('patientDetailModal');
}

function switchPatientTab(tabName) {
    // Update tab triggers
    document.querySelectorAll('#patientDetailModal .tab-trigger').forEach(trigger => {
        trigger.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('#patientDetailModal .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
}
