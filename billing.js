// ==================== BILLING MODULE ====================

let invoiceSearchQuery = '';
let currentBillingTab = 'invoices';
let revenueChart = null;
let statusChart = null;

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
                                <p class="stat-value text-success" id="totalRevenue">€0.00</p>
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
                                <p class="stat-value text-warning" id="pendingRevenue">€0.00</p>
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
                                <p class="stat-value text-danger" id="overdueRevenue">€0.00</p>
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
                    <button class="tab-trigger active" onclick="switchBillingTab('invoices')">Facturas</button>
                    <button class="tab-trigger" onclick="switchBillingTab('payments')">Pagos</button>
                    <button class="tab-trigger" onclick="switchBillingTab('tariffs')">Tarifario</button>
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
                                            <th>Seguro</th>
                                            <th>Monto</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="invoicesTableBody">
                                        <!-- Invoice rows will be rendered here -->
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
                                    <!-- Payment rows will be rendered here -->
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
                            <!-- Services will be rendered here -->
                        </div>
                        <button class="btn btn-outline" style="width: 100%; margin-top: 1rem;">
                            ${icons.plus}
                            Agregar Nuevo Servicio
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Invoice Modal -->
        <div id="newInvoiceModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Crear Nueva Factura</h3>
                    <p class="modal-description">Genera una factura electrónica para el paciente</p>
                </div>
                <div class="modal-body">
                    <form id="newInvoiceForm" class="space-y-4">
                        <div class="form-group">
                            <label>Paciente</label>
                            <select required>
                                <option value="">Selecciona un paciente</option>
                                ${patientsData.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Seguro Médico (Opcional)</label>
                            <select>
                                <option value="">Sin seguro</option>
                                <option value="plus">Seguro Salud Plus</option>
                                <option value="premium">Medicare Premium</option>
                                <option value="basic">Asistencia Básica</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Servicio</label>
                            <select required>
                                <option value="">Selecciona un servicio</option>
                                ${servicesData.map(s => `<option value="${s.id}">${s.name} - €${s.price.toFixed(2)}</option>`).join('')}
                            </select>
                        </div>
                        <div style="padding: 1rem; background-color: var(--gray-50); border-radius: var(--border-radius);">
                            <div class="flex justify-between items-center">
                                <span class="text-lg font-medium">Total:</span>
                                <span class="text-2xl font-bold" style="color: var(--primary-color);">€0.00</span>
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
    `;
    
    moduleContent.innerHTML = html;
    updateBillingStats();
    renderInvoicesList();
    renderPaymentsList();
    renderServicesList();
    initCharts();
}

function updateBillingStats() {
    const totalRevenue = invoicesData.filter(i => i.status === 'pagado').reduce((sum, i) => sum + i.amount, 0);
    const pending = invoicesData.filter(i => i.status === 'pendiente').reduce((sum, i) => sum + i.amount, 0);
    const overdue = invoicesData.filter(i => i.status === 'vencido').reduce((sum, i) => sum + i.amount, 0);
    
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('pendingRevenue').textContent = formatCurrency(pending);
    document.getElementById('overdueRevenue').textContent = formatCurrency(overdue);
    document.getElementById('totalInvoices').textContent = invoicesData.length;
}

function renderInvoicesList() {
    const tbody = document.getElementById('invoicesTableBody');
    const filtered = invoicesData.filter(invoice =>
        invoice.patientName.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
    );
    
    document.getElementById('invoicesFoundCount').textContent = `${filtered.length} facturas encontradas`;
    
    tbody.innerHTML = filtered.map(invoice => `
        <tr>
            <td class="font-medium">${invoice.id}</td>
            <td>${invoice.patientName}</td>
            <td>${formatDate(invoice.date)}</td>
            <td>${invoice.insurance || '-'}</td>
            <td class="font-semibold">${formatCurrency(invoice.amount)}</td>
            <td>${createStatusBadge(invoice.status)}</td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline btn-sm">${icons.download}</button>
                    ${invoice.status === 'pendiente' ? `
                        <button class="btn btn-success btn-sm" onclick="markAsPaid('${invoice.id}')">Cobrar</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPaymentsList() {
    const tbody = document.getElementById('paymentsTableBody');
    
    tbody.innerHTML = paymentsData.map(payment => `
        <tr>
            <td class="font-medium">${payment.id}</td>
            <td>${payment.invoiceId}</td>
            <td>${payment.patientName}</td>
            <td>${payment.method}</td>
            <td>${formatDate(payment.date)}</td>
            <td class="font-semibold text-success">${formatCurrency(payment.amount)}</td>
        </tr>
    `).join('');
}

function renderServicesList() {
    const container = document.getElementById('servicesList');
    
    container.innerHTML = servicesData.map(service => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border: 1px solid var(--gray-200); border-radius: var(--border-radius);">
            <div>
                <h4 class="font-semibold">${service.name}</h4>
                <p class="text-sm" style="color: var(--gray-600);">${service.description}</p>
            </div>
            <div style="text-align: right;">
                <p class="text-2xl font-bold" style="color: var(--primary-color);">${formatCurrency(service.price)}</p>
                <button class="btn btn-outline btn-sm mt-2">Editar</button>
            </div>
        </div>
    `).join('');
}

function filterInvoices() {
    invoiceSearchQuery = document.getElementById('invoiceSearch').value;
    renderInvoicesList();
}

function switchBillingTab(tabName) {
    currentBillingTab = tabName;
    
    // Update tab triggers
    document.querySelectorAll('.tabs .tab-trigger').forEach(trigger => {
        trigger.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Hide all tab contents
    document.getElementById('invoicesTab').classList.remove('active');
    document.getElementById('paymentsTab').classList.remove('active');
    document.getElementById('tariffsTab').classList.remove('active');
    
    // Show selected tab
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function openNewInvoiceModal() {
    showModal('newInvoiceModal');
}

function saveNewInvoice() {
    // In a real app, this would save to database
    alert('Funcionalidad de guardado no implementada en esta demo');
    hideModal('newInvoiceModal');
}

function markAsPaid(invoiceId) {
    const invoice = invoicesData.find(i => i.id === invoiceId);
    if (invoice) {
        invoice.status = 'pagado';
        updateBillingStats();
        renderInvoicesList();
        updateCharts();
    }
}

function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: monthlyRevenueData.map(d => d.month),
            datasets: [{
                label: 'Ingresos',
                data: monthlyRevenueData.map(d => d.revenue),
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
                            return 'Ingresos: €' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
                }
            }
        }
    });
    
    // Status Chart
    const statusCtx = document.getElementById('statusChart');
    if (statusChart) {
        statusChart.destroy();
    }
    
    const statusData = [
        { name: 'Pagado', count: invoicesData.filter(i => i.status === 'pagado').length, color: '#10b981' },
        { name: 'Pendiente', count: invoicesData.filter(i => i.status === 'pendiente').length, color: '#f59e0b' },
        { name: 'Vencido', count: invoicesData.filter(i => i.status === 'vencido').length, color: '#ef4444' }
    ];
    
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
