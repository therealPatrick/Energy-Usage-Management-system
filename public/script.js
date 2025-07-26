// Global variables
let records = [];
let recordToDelete = null;

// DOM elements
const addRecordForm = document.getElementById('addRecordForm');
const recordsList = document.getElementById('recordsList');
const loadingMessage = document.getElementById('loadingMessage');
const refreshBtn = document.getElementById('refreshBtn');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const editRecordForm = document.getElementById('editRecordForm');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    loadRecords();

    // Add record form submission
    addRecordForm.addEventListener('submit', handleAddRecord);

    // Refresh button
    refreshBtn.addEventListener('submit', loadRecords);

    // Edit form submission
    editRecordForm.addEventListener('submit', handleEditRecord);

    // Delete confirmation
    confirmDeleteBtn.addEventListener('click', handleDeleteRecord);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            closeEditModal();
            closeDeleteModal();
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === editModal) {
            closeEditModal();
        }
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    });
});

// API Functions
async function loadRecords() {
    try {
        showLoading(true);
        const response = await fetch('/api/usage');
        const result = await response.json();

        if (response.ok) {
            records = result.data;
            displayRecords();
        } else {
            showMessage('Error loading records: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('Error loading records: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function addRecord(customerId, kwhUsed) {
    try {
        const response = await fetch('/api/usage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_id: customerId,
                kwh_used: parseFloat(kwhUsed)
            })
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Record added successfully!', 'success');
            loadRecords();
            return true;
        } else {
            showMessage('Error adding record: ' + result.error, 'error');
            return false;
        }
    } catch (error) {
        showMessage('Error adding record: ' + error.message, 'error');
        return false;
    }
}

async function updateRecord(id, customerId, kwhUsed) {
    try {
        const response = await fetch(`/api/usage/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_id: customerId,
                kwh_used: parseFloat(kwhUsed)
            })
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Record updated successfully!', 'success');
            loadRecords();
            return true;
        } else {
            showMessage('Error updating record: ' + result.error, 'error');
            return false;
        }
    } catch (error) {
        showMessage('Error updating record: ' + error.message, 'error');
        return false;
    }
}

async function deleteRecord(id) {
    try {
        const response = await fetch(`/api/usage/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Record deleted successfully!', 'success');
            loadRecords();
            return true;
        } else {
            showMessage('Error deleting record: ' + result.error, 'error');
            return false;
        }
    } catch (error) {
        showMessage('Error deleting record: ' + error.message, 'error');
        return false;
    }
}

// Event Handlers
async function handleAddRecord(event) {
    event.preventDefault();

    const customerId = document.getElementById('customerId').value.trim();
    const kwhUsed = document.getElementById('kwhUsed').value;

    if (!customerId || !kwhUsed) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    const success = await addRecord(customerId, kwhUsed);
    if (success) {
        addRecordForm.reset();
    }
}

async function handleEditRecord(event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const customerId = document.getElementById('editCustomerId').value.trim();
    const kwhUsed = document.getElementById('editKwhUsed').value;

    if (!customerId || !kwhUsed) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    const success = await updateRecord(id, customerId, kwhUsed);
    if (success) {
        closeEditModal();
    }
}

async function handleDeleteRecord() {
    if (!recordToDelete) return;

    const success = await deleteRecord(recordToDelete.id);
    if (success) {
        closeDeleteModal();
    }
}

// UI Functions
function displayRecords() {
    if (records.length === 0) {
        recordsList.innerHTML = `
            <div class="record-card" style="text-align: center; color: #718096;">
                <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>No usage records found</p>
                <p style="font-size: 0.9rem;">Add your first record using the form on the left</p>
            </div>
        `;
        return;
    }

    recordsList.innerHTML = records.map(record => `
        <div class="record-card" data-id="${record.id}">
            <div class="record-header">
                <div class="record-info">
                    <div class="customer-id">Customer: ${escapeHtml(record.customer_id)}</div>
                    <div class="kwh-used">${record.kwh_used} kWh</div>
                    <div class="timestamp">${formatTimestamp(record.timestamp)}</div>
                    <div class="record-id">ID: ${record.id}</div>
                </div>
                <div class="record-actions">
                    <button class="btn btn-secondary btn-sm" onclick="openEditModal(${record.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${record.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openEditModal(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;

    document.getElementById('editId').value = record.id;
    document.getElementById('editCustomerId').value = record.customer_id;
    document.getElementById('editKwhUsed').value = record.kwh_used;

    editModal.style.display = 'block';
}

function closeEditModal() {
    editModal.style.display = 'none';
    editRecordForm.reset();
}

function openDeleteModal(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;

    recordToDelete = record;
    document.getElementById('deleteCustomerId').textContent = record.customer_id;
    document.getElementById('deleteKwhUsed').textContent = record.kwh_used + ' kWh';

    deleteModal.style.display = 'block';
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
    recordToDelete = null;
}

function showLoading(show) {
    loadingMessage.style.display = show ? 'block' : 'none';
    if (show) {
        recordsList.style.display = 'none';
    } else {
        recordsList.style.display = 'block';
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insert at the top of the main content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Utility Functions
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global functions for onclick handlers
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
window.closeEditModal = closeEditModal;
window.closeDeleteModal = closeDeleteModal; 