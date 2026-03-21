// ==================== BILLING MODULE ====================

let invoiceSearchQuery = '';
let currentBillingTab = 'invoices';
let revenueChart = null;
let statusChart = null;
let invoicesList = [];
let paymentsList = [];
let servicesList = [];
let monthlyRevenue = [];
let patientsListForBilling = [];

function loadBillingModule() {
    const html = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-3xl font-semibold">Facturación y Pagos</h2>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">Control financiero y facturación electrónica</p>
                </div>
                <button class="btn btn-primary" onclick="openNewInvoiceModal()">
                    ${icons.plus}
                    Nueva Factura
                </button>
            </div>

            <!-- Stats -->
            <div class="stats-grid">
                <div class="card">
                    <div class="card-content">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h3>Total Ingresos</h3>
                                <p class="stat-value text-success" id="totalRevenue">RD$ 0.00</p>
                            </div>
                            <div class="stat-icon" style="color: var(--success-color);">${icons.dollarSign}</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h3>Por Cobrar</h3>
                                <p class="stat-value text-warning" id="pendingRevenue">RD$ 0.00</p>
                            </div>
                            <div class="stat-icon" style="color: var(--warning-color);">${icons.trendingUp}</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h3>Vencidos</h3>
                                <p class="stat-value text-danger" id="overdueRevenue">RD$ 0.00</p>
                            </div>
                            <div class="stat-icon" style="color: var(--danger-color);">${icons.fileText}</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h3>Total Facturas</h3>
                                <p class="stat-value" id="totalInvoices">0</p>
                            </div>
                            <div class="stat-icon">${icons.creditCard}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts -->
            <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Ingresos Mensuales</h3>
                        <p class="card-description">Últimos 6 meses</p>
                    </div>
                    <div class="card-content">
                        <div class="chart-container">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Estado de Facturas</h3>
                        <p class="card-description">Distribución actual</p>
                    </div>
                    <div class="card-content">
                        <div class="chart-container">
                            <canvas id="statusChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <div class="tabs-list">
                    <button class="tab-trigger active" data-tab="invoices">Facturas</button>
                    <button class="tab-trigger" data-tab="payments">Pagos</button>
                    <button class="tab-trigger" data-tab="tariffs">Tarifario</button>
                </div>
            </div>

            <!-- Tab Contents -->
            <div id="invoicesTab" class="tab-content active">
                <div class="space-y-4">
                    <!-- Search -->
                    <div class="card">
                        <div class="card-content">
                            <div class="search-container" style="margin-bottom: 0;">
                                <span class="search-icon">${icons.search}</span>
                                <input 
                                    type="text" 
                                    class="search-input" 
                                    placeholder="Buscar por paciente o número de factura..." 
                                    id="invoiceSearch"
                                    onkeyup="filterInvoices()"
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Invoice List -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Listado de Facturas</h3>
                            <p class="card-description" id="invoicesFoundCount">0 facturas encontradas</p>
                        </div>
                        <div class="card-content">
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Factura</th>
                                            <th>Paciente</th>
                                            <th>Fecha</th>
                                            <th>ARS</th>
                                            <th>Monto</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="invoicesTableBody">
                                        <tr>
                                            <td colspan="7" class="text-center">Cargando facturas...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="paymentsTab" class="tab-content">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Historial de Pagos</h3>
                        <p class="card-description">Registro de todos los pagos recibidos</p>
                    </div>
                    <div class="card-content">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID Pago</th>
                                        <th>Factura</th>
                                        <th>Paciente</th>
                                        <th>Método</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                    </tr>
                                </thead>
                                <tbody id="paymentsTableBody">
                                    <tr>
                                        <td colspan="6" class="text-center">Cargando pagos...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id="tariffsTab" class="tab-content">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Tarifario de Servicios</h3>
                        <p class="card-description">Precios personalizados por servicio médico</p>
                    </div>
                    <div class="card-content">
                        <div id="servicesList" class="space-y-4">
                            <div class="text-center" style="padding: 2rem;">Cargando servicios...</div>
                        </div>
                        <button class="btn btn-outline" style="width: 100%; margin-top: 1rem;" onclick="openNewServiceModal()">
                            ${icons.plus}
                            Agregar Nuevo Servicio
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Invoice Modal -->
        <div id="newInvoiceModal" class="modal-overlay">
            <div class="modal" style="max-width: 700px;">
                <div class="modal-header">
                    <h3 class="modal-title">Crear Nueva Factura</h3>
                    <p class="modal-description">Genera una factura electrónica para el paciente</p>
                </div>
                <div class="modal-body">
                    <form id="newInvoiceForm" class="space-y-4">
                        <div class="form-group">
                            <label>Paciente *</label>
                            <select id="invoicePatientId" required>
                                <option value="">Selecciona un paciente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>ARS (Opcional)</label>
                            <select id="invoiceArs">
                                <option value="">Sin ARS</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Fecha *</label>
                                <input type="date" id="invoiceDate" required>
                            </div>
                            <div class="form-group">
                                <label>Servicio</label>
                                <select id="invoiceServiceId">
                                    <option value="">Selecciona un servicio</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label>Cantidad</label>
                                <input type="number" id="invoiceQuantity" value="1" min="1">
                            </div>
                            <div class="form-group">
                                <label>Precio Unitario (RD$)</label>
                                <input type="number" id="invoiceUnitPrice" step="0.01" placeholder="0.00">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Descripción Adicional</label>
                            <textarea id="invoiceDescription" placeholder="Descripción del servicio o procedimiento" rows="2"></textarea>
                        </div>
                        <div style="padding: 1rem; background-color: var(--gray-50); border-radius: var(--border-radius);">
                            <div class="flex justify-between items-center">
                                <span class="text-lg font-medium">Total:</span>
                                <span class="text-2xl font-bold" style="color: var(--primary-color);" id="invoiceTotal">RD$ 0.00</span>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('newInvoiceModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="saveNewInvoice()">Generar Factura</button>
                </div>
            </div>
        </div>

        <!-- New Service Modal -->
        <div id="newServiceModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Agregar Nuevo Servicio</h3>
                    <p class="modal-description">Define un nuevo servicio médico con su precio</p>
                </div>
                <div class="modal-body">
                    <form id="newServiceForm" class="space-y-4">
                        <div class="form-group">
                            <label>Nombre del Servicio *</label>
                            <input type="text" id="serviceName" placeholder="Ej: Consulta General" required>
                        </div>
                        <div class="form-group">
                            <label>Descripción</label>
                            <textarea id="serviceDescription" placeholder="Descripción del servicio" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Precio (RD$) *</label>
                            <input type="number" id="servicePrice" placeholder="0.00" step="0.01" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('newServiceModal')">Cancelar</button>
                    <button class="btn btn-primary" onclick="saveNewService()">Guardar Servicio</button>
                </div>
            </div>
        </div>

        <!-- Payment Modal -->
        <div id="paymentModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Registrar Pago</h3>
                    <p class="modal-description">Registra el pago de la factura</p>
                </div>
                <div class="modal-body">
                    <form id="paymentForm" class="space-y-4">
                        <input type="hidden" id="paymentInvoiceId">
                        <div class="form-group">
                            <label>Factura</label>
                            <p id="paymentInvoiceNumber" class="font-semibold"></p>
                        </div>
                        <div class="form-group">
                            <label>Paciente</label>
                            <p id="paymentPatientName" class="font-semibold"></p>
                        </div>
                        <div class="form-group">
                            <label>Monto a Pagar (RD$)</label>
                            <input type="number" id="paymentAmount" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Método de Pago</label>
                            <select id="paymentMethod" required>
                                <option value="">Seleccionar</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Fecha de Pago</label>
                            <input type="date" id="paymentDate" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="hideModal('paymentModal')">Cancelar</button>
                    <button class="btn btn-success" onclick="savePayment()">Registrar Pago</button>
                </div>
            </div>
        </div>
    `;
    
    moduleContent.innerHTML = html;
    
    // Setup tab listeners
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => switchBillingTab(trigger.getAttribute('data-tab')));
    });
    
    // Set default date to today
    const dateInput = document.getElementById('invoiceDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    const paymentDateInput = document.getElementById('paymentDate');
    if (paymentDateInput) {
        paymentDateInput.value = new Date().toISOString().split('T')[0];
    }
    
    loadAllBillingData();
}

async function loadAllBillingData() {
    await Promise.all([
        loadInvoices(),
        loadPayments(),
        loadServices(),
        loadPatientsForBilling(),
        loadARSForBilling(),
        loadMonthlyRevenueData()
    ]);
}

async function loadInvoices() {
    const result = await loadInvoicesFromDB();
    
    if (result.success) {
        invoicesList = result.data;
        updateBillingStats();
        renderInvoicesList();
        initCharts();
    } else {
        const tbody = document.getElementById('invoicesTableBody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error: ${result.error}</td></tr>`;
        }
    }
}

async function loadPayments() {
    const result = await loadPaymentsFromDB();
    
    if (result.success) {
        paymentsList = result.data;
        renderPaymentsList();
    } else {
        const tbody = document.getElementById('paymentsTableBody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error: ${result.error}</td></tr>`;
        }
    }
}

async function loadServices() {
    const result = await loadServicesFromDB();
    
    if (result.success) {
        servicesList = result.data;
        renderServicesList();
        
        // Populate service select in invoice modal
        const serviceSelect = document.getElementById('invoiceServiceId');
        if (serviceSelect) {
            serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>' + 
                servicesList.map(s => `<option value="${s.id}" data-price="${s.price}">${escapeHtml(s.name)} - RD$ ${s.price.toFixed(2)}</option>`).join('');
            
            // Add event listeners
            serviceSelect.onchange = updateInvoiceTotal;
            const quantityInput = document.getElementById('invoiceQuantity');
            const unitPriceInput = document.getElementById('invoiceUnitPrice');
            if (quantityInput) quantityInput.onchange = updateInvoiceTotal;
            if (quantityInput) quantityInput.onkeyup = updateInvoiceTotal;
            if (unitPriceInput) unitPriceInput.onchange = updateInvoiceTotal;
            if (unitPriceInput) unitPriceInput.onkeyup = updateInvoiceTotal;
        }
    } else {
        const container = document.getElementById('servicesList');
        if (container) {
            container.innerHTML = `<div class="text-center text-danger">Error: ${result.error}</div>`;
        }
    }
}

async function loadPatientsForBilling() {
    const result = await loadPatientsFromDB();
    
    if (result.success) {
        patientsListForBilling = result.data;
        
        const patientOptions = patientsListForBilling.map(p => 
            `<option value="${p.id}">${escapeHtml(p.nombre)} - ${p.cedula || ''}</option>`
        ).join('');
        
        const patientSelect = document.getElementById('invoicePatientId');
        if (patientSelect) {
            patientSelect.innerHTML = '<option value="">Selecciona un paciente</option>' + patientOptions;
        }
    }
}

async function loadARSForBilling() {
    const result = await loadARSList();
    
    if (result.success) {
        const arsOptions = result.data.map(ars => 
            `<option value="${ars.nombre}">${ars.nombre}</option>`
        ).join('');
        
        const arsSelect = document.getElementById('invoiceArs');
        if (arsSelect) {
            arsSelect.innerHTML = '<option value="">Sin ARS</option>' + arsOptions;
        }
    }
}

async function loadMonthlyRevenueData() {
    const result = await loadMonthlyRevenue();
    
    if (result.success) {
        monthlyRevenue = result.data;
        if (revenueChart) {
            revenueChart.data.datasets[0].data = monthlyRevenue.map(m => m.revenue);
            revenueChart.update();
        }
    }
}

function updateBillingStats() {
    const totalRevenue = invoicesList.filter(i => i.status === 'pagado').reduce((sum, i) => sum + i.amount, 0);
    const pending = invoicesList.filter(i => i.status === 'pendiente').reduce((sum, i) => sum + i.amount, 0);
    const overdue = invoicesList.filter(i => i.status === 'vencido').reduce((sum, i) => sum + i.amount, 0);
    
    const totalRevenueEl = document.getElementById('totalRevenue');
    const pendingRevenueEl = document.getElementById('pendingRevenue');
    const overdueRevenueEl = document.getElementById('overdueRevenue');
    const totalInvoicesEl = document.getElementById('totalInvoices');
    
    if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(totalRevenue);
    if (pendingRevenueEl) pendingRevenueEl.textContent = formatCurrency(pending);
    if (overdueRevenueEl) overdueRevenueEl.textContent = formatCurrency(overdue);
    if (totalInvoicesEl) totalInvoicesEl.textContent = invoicesList.length;
}

function renderInvoicesList() {
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;
    
    const filtered = invoicesList.filter(invoice =>
        invoice.patientName?.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
        invoice.invoiceNumber?.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
    );
    
    const foundCountEl = document.getElementById('invoicesFoundCount');
    if (foundCountEl) foundCountEl.textContent = `${filtered.length} facturas encontradas`;
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron facturas</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(invoice => `
        <tr>
            <td class="font-medium">${escapeHtml(invoice.invoiceNumber || invoice.id?.slice(0, 8) || '-')}</td>
            <td>${escapeHtml(invoice.patientName)}</td>
            <td>${invoice.date ? formatDate(invoice.date) : '-'}</td>
            <td>${escapeHtml(invoice.insurance || '-')}</td>
            <td class="font-semibold">${formatCurrency(invoice.amount)}</td>
            <td>${createStatusBadge(invoice.status)}</td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline btn-sm" onclick="viewInvoice('${invoice.id}')">Ver</button>
                    ${invoice.status === 'pendiente' ? `
                        <button class="btn btn-success btn-sm" onclick="openPaymentModal('${invoice.id}')">Cobrar</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPaymentsList() {
    const tbody = document.getElementById('paymentsTableBody');
    if (!tbody) return;
    
    if (paymentsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay pagos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = paymentsList.map(payment => `
        <tr>
            <td class="font-medium">${escapeHtml(payment.id || payment.paymentId?.slice(0, 8) || '-')}</td>
            <td>${escapeHtml(payment.invoiceId || '-')}</td>
            <td>${escapeHtml(payment.patientName)}</td>
            <td>${escapeHtml(payment.method || '-')}</td>
            <td>${payment.date ? formatDate(payment.date) : '-'}</td>
            <td class="font-semibold text-success">${formatCurrency(payment.amount)}</td>
        </tr>
    `).join('');
}

function renderServicesList() {
    const container = document.getElementById('servicesList');
    if (!container) return;
    
    if (servicesList.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 2rem; color: var(--gray-500);">
                <p>No hay servicios registrados</p>
                <p class="text-sm">Haz clic en "Agregar Nuevo Servicio" para comenzar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = servicesList.map(service => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border: 1px solid var(--gray-200); border-radius: var(--border-radius);">
            <div>
                <h4 class="font-semibold">${escapeHtml(service.name)}</h4>
                <p class="text-sm" style="color: var(--gray-600);">${escapeHtml(service.description || '')}</p>
            </div>
            <div style="text-align: right;">
                <p class="text-2xl font-bold" style="color: var(--primary-color);">${formatCurrency(service.price)}</p>
            </div>
        </div>
    `).join('');
}

function updateInvoiceTotal() {
    const serviceSelect = document.getElementById('invoiceServiceId');
    const quantityInput = document.getElementById('invoiceQuantity');
    const unitPriceInput = document.getElementById('invoiceUnitPrice');
    const totalSpan = document.getElementById('invoiceTotal');
    
    let total = 0;
    
    // Check if service is selected
    if (serviceSelect && serviceSelect.value) {
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const price = parseFloat(selectedOption?.getAttribute('data-price') || 0);
        const quantity = parseInt(quantityInput?.value) || 0;
        total = price * quantity;
    } else if (unitPriceInput && unitPriceInput.value) {
        // Manual price entry
        const price = parseFloat(unitPriceInput.value) || 0;
        const quantity = parseInt(quantityInput?.value) || 0;
        total = price * quantity;
    }
    
    if (totalSpan) totalSpan.textContent = formatCurrency(total);
}

function filterInvoices() {
    invoiceSearchQuery = document.getElementById('invoiceSearch').value;
    renderInvoicesList();
}

function switchBillingTab(tabName) {
    currentBillingTab = tabName;
    
    // Update tab triggers
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
        if (trigger.getAttribute('data-tab') === tabName) {
            trigger.classList.add('active');
        } else {
            trigger.classList.remove('active');
        }
    });
    
    // Hide all tab contents
    const tabs = ['invoices', 'payments', 'tariffs'];
    tabs.forEach(tab => {
        const element = document.getElementById(`${tab}Tab`);
        if (element) element.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}Tab`);
    if (selectedTab) selectedTab.classList.add('active');
}

function openNewInvoiceModal() {
    // Reset form
    const patientSelect = document.getElementById('invoicePatientId');
    const serviceSelect = document.getElementById('invoiceServiceId');
    const quantityInput = document.getElementById('invoiceQuantity');
    const unitPriceInput = document.getElementById('invoiceUnitPrice');
    const descriptionInput = document.getElementById('invoiceDescription');
    
    if (patientSelect) patientSelect.value = '';
    if (serviceSelect) serviceSelect.value = '';
    if (quantityInput) quantityInput.value = '1';
    if (unitPriceInput) unitPriceInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
    
    updateInvoiceTotal();
    showModal('newInvoiceModal');
}

async function saveNewInvoice() {
    const patientId = document.getElementById('invoicePatientId').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const serviceSelect = document.getElementById('invoiceServiceId');
    const quantity = parseInt(document.getElementById('invoiceQuantity').value) || 1;
    const unitPriceInput = document.getElementById('invoiceUnitPrice');
    const description = document.getElementById('invoiceDescription').value;
    const ars = document.getElementById('invoiceArs').value;
    
    // Validate required fields
    if (!patientId) {
        alert('Por favor seleccione un paciente');
        return;
    }
    
    if (!invoiceDate) {
        alert('Por favor seleccione una fecha');
        return;
    }
    
    let total = 0;
    let items = [];
    
    if (serviceSelect && serviceSelect.value) {
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const serviceName = selectedOption.text.split(' - ')[0];
        const price = parseFloat(selectedOption.getAttribute('data-price') || 0);
        total = price * quantity;
        items.push({
            description: serviceName + (description ? ` - ${description}` : ''),
            price: price
        });
    } else if (unitPriceInput && unitPriceInput.value) {
        const price = parseFloat(unitPriceInput.value);
        total = price * quantity;
        items.push({
            description: description || 'Servicio médico',
            price: price
        });
    } else {
        alert('Por favor seleccione un servicio o ingrese un precio');
        return;
    }
    
    const invoiceData = {
        patientId: patientId,
        date: invoiceDate,
        total: total,
        insurance: ars || null
    };
    
    const result = await saveInvoiceToDB(invoiceData, items);
    
    if (result.success) {
        showNotification('Factura generada exitosamente');
        hideModal('newInvoiceModal');
        await loadInvoices();
        await loadMonthlyRevenueData();
    } else {
        alert('Error al generar factura: ' + result.error);
    }
}

function openNewServiceModal() {
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('servicePrice').value = '';
    showModal('newServiceModal');
}

async function saveNewService() {
    const serviceName = document.getElementById('serviceName').value;
    const serviceDescription = document.getElementById('serviceDescription').value;
    const servicePrice = parseFloat(document.getElementById('servicePrice').value);
    
    if (!serviceName || !servicePrice) {
        alert('Por favor complete los campos requeridos: Nombre y Precio');
        return;
    }
    
    const serviceData = {
        name: serviceName,
        description: serviceDescription,
        price: servicePrice
    };
    
    const result = await saveServiceToDB(serviceData);
    
    if (result.success) {
        showNotification('Servicio agregado exitosamente');
        hideModal('newServiceModal');
        await loadServices();
    } else {
        alert('Error al guardar servicio: ' + result.error);
    }
}

function openPaymentModal(invoiceId) {
    const invoice = invoicesList.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    document.getElementById('paymentInvoiceId').value = invoice.id;
    document.getElementById('paymentInvoiceNumber').textContent = invoice.invoiceNumber || invoice.id.slice(0, 8);
    document.getElementById('paymentPatientName').textContent = invoice.patientName;
    document.getElementById('paymentAmount').value = invoice.amount;
    document.getElementById('paymentMethod').value = '';
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
    
    showModal('paymentModal');
}

async function savePayment() {
    const invoiceId = document.getElementById('paymentInvoiceId').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const method = document.getElementById('paymentMethod').value;
    const paymentDate = document.getElementById('paymentDate').value;
    
    if (!amount || !method || !paymentDate) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    const invoice = invoicesList.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    const paymentData = {
        invoiceId: invoiceId,
        patientId: invoice.patientId,
        amount: amount,
        method: method,
        date: paymentDate
    };
    
    const result = await savePaymentToDB(paymentData);
    
    if (result.success) {
        showNotification('Pago registrado exitosamente');
        hideModal('paymentModal');
        await loadInvoices();
        await loadPayments();
        await loadMonthlyRevenueData();
    } else {
        alert('Error al registrar pago: ' + result.error);
    }
}

function viewInvoice(invoiceId) {
    const invoice = invoicesList.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    // Simple invoice view - can be enhanced with a modal
    alert(`Factura: ${invoice.invoiceNumber || invoice.id}\nPaciente: ${invoice.patientName}\nMonto: ${formatCurrency(invoice.amount)}\nEstado: ${invoice.status}`);
}

function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (!revenueCtx) return;
    
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    const revenueData = monthlyRevenue.length > 0 ? monthlyRevenue : [
        { month: 'Ene', revenue: 0 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 },
        { month: 'Abr', revenue: 0 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 0 }
    ];
    
    revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: revenueData.map(d => d.month),
            datasets: [{
                label: 'Ingresos',
                data: revenueData.map(d => d.revenue),
                backgroundColor: '#3b82f6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Ingresos: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'RD$ ' + value;
                        }
                    }
                }
            }
        }
    });
    
    // Status Chart
    const statusCtx = document.getElementById('statusChart');
    if (!statusCtx) return;
    
    if (statusChart) {
        statusChart.destroy();
    }
    
    const statusData = [
        { name: 'Pagado', count: invoicesList.filter(i => i.status === 'pagado').length, color: '#10b981' },
        { name: 'Pendiente', count: invoicesList.filter(i => i.status === 'pendiente').length, color: '#f59e0b' },
        { name: 'Vencido', count: invoicesList.filter(i => i.status === 'vencido').length, color: '#ef4444' },
        { name: 'Anulado', count: invoicesList.filter(i => i.status === 'anulado').length, color: '#6b7280' }
    ].filter(d => d.count > 0);
    
    if (statusData.length === 0) {
        statusData.push({ name: 'Sin datos', count: 1, color: '#9ca3af' });
    }
    
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: statusData.map(d => d.name),
            datasets: [{
                data: statusData.map(d => d.count),
                backgroundColor: statusData.map(d => d.color),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed} facturas`;
                        }
                    }
                }
            }
        }
    });
}

function updateCharts() {
    if (revenueChart || statusChart) {
        initCharts();
    }
}