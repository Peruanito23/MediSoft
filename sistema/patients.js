// ==================== PATIENTS MODULE ====================

let selectedPatient = null;
let patientSearchQuery = '';
let patientsList = [];

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
                            placeholder="Buscar por nombre o cédula..." 
                            id="patientSearch"
                            onkeyup="filterPatients()"
                        >
                    </div>
                </div>
            </div>

            <!-- Patient List -->
            <div id="patientList" class="space-y-4">
                <div class="text-center" style="padding: 3rem;">
                    <div class="loading-spinner"></div>
                    <p style="margin-top: 1rem; color: var(--gray-600);">Cargando pacientes...</p>
                </div>
            </div>
        </div>

        <!-- New Patient Modal -->
        <div id="newPatientModal" class="modal-overlay">
            <div class="modal" style="max-width: 700px;">
                <div class="modal-header">
                    <h3 class="modal-title">Registrar Nuevo Paciente</h3>
                    <p class="modal-description">Completa la información del nuevo paciente</p>
                </div>
                <div class="modal-body">
                    <form id="newPatientForm" class="space-y-4">
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Nombre Completo *</label>
                                <input type="text" id="patientName" placeholder="Nombre del paciente" required>
                            </div>
                            <div class="form-group">
                                <label>Cédula *</label>
                                <input type="text" id="patientCedula" placeholder="001-1234567-8" required>
                            </div>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Edad</label>
                                <input type="number" id="patientAge" placeholder="Edad">
                            </div>
                            <div class="form-group">
                                <label>Género</label>
                                <select id="patientGender">
                                    <option value="">Seleccionar</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Teléfono</label>
                                <input type="tel" id="patientPhone" placeholder="809-555-1234">
                            </div>
                            <div class="form-group">
                                <label>Tipo de Sangre</label>
                                <select id="patientBloodType">
                                    <option value="">Seleccionar</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Dirección</label>
                            <input type="text" id="patientAddress" placeholder="Dirección completa">
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Seguro Médico (ARS)</label>
                                <select id="patientInsurance">
                                    <option value="">Seleccionar ARS</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Número de Póliza</label>
                                <input type="text" id="patientInsuranceNumber" placeholder="Número de póliza">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Alergias</label>
                            <textarea id="patientAllergies" placeholder="Lista de alergias conocidas (separadas por comas)" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Condiciones Crónicas</label>
                            <textarea id="patientConditions" placeholder="Condiciones crónicas (separadas por comas)" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Medicamentos Actuales</label>
                            <textarea id="patientMedications" placeholder="Medicamentos actuales (separados por comas)" rows="2"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('newPatientModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="saveNewPatient()">Guardar Paciente</button>
                </div>
            </div>
        </div>

        <!-- Edit Patient Modal -->
        <div id="editPatientModal" class="modal-overlay">
            <div class="modal" style="max-width: 700px;">
                <div class="modal-header">
                    <h3 class="modal-title">Editar Paciente</h3>
                    <p class="modal-description">Actualiza la información del paciente</p>
                </div>
                <div class="modal-body">
                    <form id="editPatientForm" class="space-y-4">
                        <input type="hidden" id="editPatientId">
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Nombre Completo *</label>
                                <input type="text" id="editPatientName" placeholder="Nombre del paciente" required>
                            </div>
                            <div class="form-group">
                                <label>Cédula *</label>
                                <input type="text" id="editPatientCedula" placeholder="001-1234567-8" required>
                            </div>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Edad</label>
                                <input type="number" id="editPatientAge" placeholder="Edad">
                            </div>
                            <div class="form-group">
                                <label>Género</label>
                                <select id="editPatientGender">
                                    <option value="">Seleccionar</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Teléfono</label>
                                <input type="tel" id="editPatientPhone" placeholder="809-555-1234">
                            </div>
                            <div class="form-group">
                                <label>Tipo de Sangre</label>
                                <select id="editPatientBloodType">
                                    <option value="">Seleccionar</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Dirección</label>
                            <input type="text" id="editPatientAddress" placeholder="Dirección completa">
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Seguro Médico (ARS)</label>
                                <select id="editPatientInsurance">
                                    <option value="">Seleccionar ARS</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Número de Póliza</label>
                                <input type="text" id="editPatientInsuranceNumber" placeholder="Número de póliza">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Alergias</label>
                            <textarea id="editPatientAllergies" placeholder="Lista de alergias conocidas (separadas por comas)" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Condiciones Crónicas</label>
                            <textarea id="editPatientConditions" placeholder="Condiciones crónicas (separadas por comas)" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Medicamentos Actuales</label>
                            <textarea id="editPatientMedications" placeholder="Medicamentos actuales (separados por comas)" rows="2"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('editPatientModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="updatePatient()">Actualizar Paciente</button>
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
                            <div class="flex gap-2 mt-4" style="justify-content: flex-end;">
                                <button class="btn btn-outline btn-sm" onclick="openEditPatientModal()">
                                    ${icons.edit}
                                    Editar Paciente
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deletePatient()">
                                    ${icons.trash}
                                    Eliminar Paciente
                                </button>
                            </div>
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
                                        <p style="color: var(--gray-600);">Funcionalidad en desarrollo</p>
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
    loadPatients();
    loadARSForSelect();
}

async function loadPatients() {
    const container = document.getElementById('patientList');
    showLoading('patientList');
    
    const result = await loadPatientsFromDB();
    
    if (result.success) {
        patientsList = result.data;
        renderPatientList();
    } else {
        showError('patientList', 'Error al cargar pacientes: ' + result.error);
    }
}

async function loadARSForSelect() {
    const result = await loadARSList();
    
    if (result.success) {
        const arsOptions = result.data.map(ars => 
            `<option value="${ars.nombre}">${ars.nombre}</option>`
        ).join('');
        
        const newPatientSelect = document.getElementById('patientInsurance');
        const editPatientSelect = document.getElementById('editPatientInsurance');
        
        if (newPatientSelect) {
            newPatientSelect.innerHTML = '<option value="">Seleccionar ARS</option>' + arsOptions;
        }
        if (editPatientSelect) {
            editPatientSelect.innerHTML = '<option value="">Seleccionar ARS</option>' + arsOptions;
        }
    }
}

function renderPatientList() {
    const container = document.getElementById('patientList');
    const filtered = patientsList.filter(patient => 
        patient.nombre.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
        (patient.cedula && patient.cedula.toLowerCase().includes(patientSearchQuery.toLowerCase()))
    );
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--gray-500); padding: 2rem;">No se encontraron pacientes</p>';
        return;
    }
    
    container.innerHTML = filtered.map(patient => `
        <div class="patient-card" onclick="openPatientDetail('${patient.id}')">
            <div class="patient-header">
                <h3 class="text-lg font-semibold">${escapeHtml(patient.nombre)}</h3>
                <span class="badge badge-secondary">${patient.tipo_sangre || 'N/A'}</span>
                ${patient.edad ? `<span class="badge badge-secondary">${patient.edad} años</span>` : ''}
            </div>
            <div class="patient-info-grid">
                <div>
                    <p><span class="font-medium">Cédula:</span> ${patient.cedula || '-'}</p>
                    <p><span class="font-medium">Teléfono:</span> ${patient.telefono || '-'}</p>
                </div>
                <div>
                    <p><span class="font-medium">Género:</span> ${patient.genero || '-'}</p>
                    <p><span class="font-medium">ARS:</span> ${patient.seguro_medico || '-'}</p>
                </div>
            </div>
            ${((patient.alergias && patient.alergias.length > 0) || (patient.condiciones_cronicas && patient.condiciones_cronicas.length > 0)) ? `
                <div class="patient-alerts">
                    ${patient.alergias && patient.alergias.length > 0 ? `
                        <div class="alert-item alert-danger">
                            ${icons.alertCircle}
                            <span class="font-medium">Alergias: ${Array.isArray(patient.alergias) ? patient.alergias.join(', ') : patient.alergias}</span>
                        </div>
                    ` : ''}
                    ${patient.condiciones_cronicas && patient.condiciones_cronicas.length > 0 ? `
                        <div class="alert-item alert-warning">
                            ${icons.fileText}
                            <span class="font-medium">${Array.isArray(patient.condiciones_cronicas) ? patient.condiciones_cronicas.join(', ') : patient.condiciones_cronicas}</span>
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
    // Reset form
    document.getElementById('patientName').value = '';
    document.getElementById('patientCedula').value = '';
    document.getElementById('patientAge').value = '';
    document.getElementById('patientGender').value = '';
    document.getElementById('patientPhone').value = '';
    document.getElementById('patientAddress').value = '';
    document.getElementById('patientBloodType').value = '';
    document.getElementById('patientInsurance').value = '';
    document.getElementById('patientInsuranceNumber').value = '';
    document.getElementById('patientAllergies').value = '';
    document.getElementById('patientConditions').value = '';
    document.getElementById('patientMedications').value = '';
    showModal('newPatientModal');
}

async function saveNewPatient() {
    const patientData = {
        name: document.getElementById('patientName').value,
        cedula: document.getElementById('patientCedula').value,
        age: parseInt(document.getElementById('patientAge').value) || null,
        gender: document.getElementById('patientGender').value,
        phone: document.getElementById('patientPhone').value,
        address: document.getElementById('patientAddress').value,
        bloodType: document.getElementById('patientBloodType').value,
        insurance: document.getElementById('patientInsurance').value,
        insuranceNumber: document.getElementById('patientInsuranceNumber').value,
        allergies: document.getElementById('patientAllergies').value,
        conditions: document.getElementById('patientConditions').value,
        medications: document.getElementById('patientMedications').value
    };
    
    // Validate required fields
    if (!patientData.name || !patientData.cedula) {
        alert('Por favor complete los campos requeridos: Nombre y Cédula');
        return;
    }
    
    // Validate cédula format (simple validation)
    if (patientData.cedula && !/^\d{3}-\d{7}-\d$/.test(patientData.cedula)) {
        if (!confirm('La cédula no tiene el formato recomendado (XXX-XXXXXXX-X). ¿Desea continuar?')) {
            return;
        }
    }
    
    const result = await savePatientToDB(patientData);
    
    if (result.success) {
        showNotification('Paciente registrado exitosamente');
        hideModal('newPatientModal');
        await loadPatients();
    } else {
        alert('Error al guardar paciente: ' + result.error);
    }
}

function openEditPatientModal() {
    if (!selectedPatient) return;
    
    // Fill edit form
    document.getElementById('editPatientId').value = selectedPatient.id;
    document.getElementById('editPatientName').value = selectedPatient.nombre || '';
    document.getElementById('editPatientCedula').value = selectedPatient.cedula || '';
    document.getElementById('editPatientAge').value = selectedPatient.edad || '';
    document.getElementById('editPatientGender').value = selectedPatient.genero || '';
    document.getElementById('editPatientPhone').value = selectedPatient.telefono || '';
    document.getElementById('editPatientAddress').value = selectedPatient.direccion || '';
    document.getElementById('editPatientBloodType').value = selectedPatient.tipo_sangre || '';
    document.getElementById('editPatientInsurance').value = selectedPatient.seguro_medico || '';
    document.getElementById('editPatientInsuranceNumber').value = selectedPatient.numero_seguro || '';
    
    // Handle arrays
    const allergies = Array.isArray(selectedPatient.alergias) ? selectedPatient.alergias.join(', ') : (selectedPatient.alergias || '');
    const conditions = Array.isArray(selectedPatient.condiciones_cronicas) ? selectedPatient.condiciones_cronicas.join(', ') : (selectedPatient.condiciones_cronicas || '');
    const medications = Array.isArray(selectedPatient.medicamentos) ? selectedPatient.medicamentos.join(', ') : (selectedPatient.medicamentos || '');
    
    document.getElementById('editPatientAllergies').value = allergies;
    document.getElementById('editPatientConditions').value = conditions;
    document.getElementById('editPatientMedications').value = medications;
    
    hideModal('patientDetailModal');
    showModal('editPatientModal');
}

async function updatePatient() {
    const patientId = document.getElementById('editPatientId').value;
    
    const patientData = {
        name: document.getElementById('editPatientName').value,
        cedula: document.getElementById('editPatientCedula').value,
        age: parseInt(document.getElementById('editPatientAge').value) || null,
        gender: document.getElementById('editPatientGender').value,
        phone: document.getElementById('editPatientPhone').value,
        address: document.getElementById('editPatientAddress').value,
        bloodType: document.getElementById('editPatientBloodType').value,
        insurance: document.getElementById('editPatientInsurance').value,
        insuranceNumber: document.getElementById('editPatientInsuranceNumber').value,
        allergies: document.getElementById('editPatientAllergies').value,
        conditions: document.getElementById('editPatientConditions').value,
        medications: document.getElementById('editPatientMedications').value
    };
    
    if (!patientData.name || !patientData.cedula) {
        alert('Por favor complete los campos requeridos: Nombre y Cédula');
        return;
    }
    
    const result = await updatePatientInDB(patientId, patientData);
    
    if (result.success) {
        showNotification('Paciente actualizado exitosamente');
        hideModal('editPatientModal');
        await loadPatients();
        
        // Refresh detail view if open
        if (selectedPatient && selectedPatient.id === patientId) {
            await openPatientDetail(patientId);
        }
    } else {
        alert('Error al actualizar paciente: ' + result.error);
    }
}

async function deletePatient() {
    if (!selectedPatient) return;
    
    const confirmed = confirm(`¿Está seguro de eliminar a ${selectedPatient.nombre}? Esta acción no se puede deshacer.`);
    
    if (confirmed) {
        const result = await deletePatientFromDB(selectedPatient.id);
        
        if (result.success) {
            showNotification('Paciente eliminado exitosamente');
            hideModal('patientDetailModal');
            await loadPatients();
        } else {
            alert('Error al eliminar paciente: ' + result.error);
        }
    }
}

async function openPatientDetail(patientId) {
    selectedPatient = patientsList.find(p => p.id === patientId);
    if (!selectedPatient) return;
    
    // Update modal content
    document.getElementById('patientDetailName').textContent = selectedPatient.nombre;
    
    // Info tab
    document.getElementById('patientInfoContent').innerHTML = `
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Nombre Completo</label>
            <p class="text-lg font-medium mt-2">${escapeHtml(selectedPatient.nombre || '-')}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Cédula</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.cedula || '-'}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Edad</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.edad ? selectedPatient.edad + ' años' : '-'}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Género</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.genero || '-'}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Tipo de Sangre</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.tipo_sangre || '-'}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Teléfono</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.telefono || '-'}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">ARS</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.seguro_medico || '-'}</p>
        </div>
        <div>
            <label style="color: var(--gray-600); font-size: 0.875rem;">Número de Póliza</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.numero_seguro || '-'}</p>
        </div>
        <div style="grid-column: span 2;">
            <label style="color: var(--gray-600); font-size: 0.875rem;">Dirección</label>
            <p class="text-lg font-medium mt-2">${selectedPatient.direccion || '-'}</p>
        </div>
    `;
    
    // Allergies
    const allergies = selectedPatient.alergias;
    const allergiesArray = Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',').map(a => a.trim()) : []);
    document.getElementById('allergiesList').innerHTML = allergiesArray.length > 0 
        ? allergiesArray.map(a => `<span class="badge badge-danger" style="margin-right: 0.5rem;">${escapeHtml(a)}</span>`).join('')
        : '<p style="color: var(--gray-500);">Sin alergias registradas</p>';
    
    // Conditions
    const conditions = selectedPatient.condiciones_cronicas;
    const conditionsArray = Array.isArray(conditions) ? conditions : (conditions ? conditions.split(',').map(c => c.trim()) : []);
    document.getElementById('conditionsList').innerHTML = conditionsArray.length > 0
        ? conditionsArray.map(c => `<span class="badge badge-outline" style="margin-right: 0.5rem;">${escapeHtml(c)}</span>`).join('')
        : '<p style="color: var(--gray-500);">Sin condiciones crónicas registradas</p>';
    
    // Medications
    const medications = selectedPatient.medicamentos;
    const medicationsArray = Array.isArray(medications) ? medications : (medications ? medications.split(',').map(m => m.trim()) : []);
    document.getElementById('medicationsList').innerHTML = medicationsArray.length > 0
        ? medicationsArray.map(m => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background-color: #dbeafe; border-radius: var(--border-radius); margin-bottom: 0.5rem;">
                <span class="font-medium">${escapeHtml(m)}</span>
                <span class="badge badge-success">Activo</span>
            </div>
        `).join('')
        : '<p style="color: var(--gray-500);">Sin medicamentos registrados</p>';
    
    showModal('patientDetailModal');
}

function switchPatientTab(tabName) {
    // Update tab triggers
    const triggers = document.querySelectorAll('#patientDetailModal .tab-trigger');
    triggers.forEach(trigger => {
        trigger.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    const contents = document.querySelectorAll('#patientDetailModal .tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
