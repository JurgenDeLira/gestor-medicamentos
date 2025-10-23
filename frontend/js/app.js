
// URL base de la API
const API_BASE = (window.API_BASE || 'http://localhost:3000') + '/api/medicamentos';

// Renderizar filas de la tabla con datos obtenidos
function renderRows(items) {
    const $tbody = $('#tablaMedicamentos tbody');
    $tbody.empty();
    if (!items.length) {
        $tbody.append('<tr><td colspan="6" class="text-center text-muted">Sin resultados</td></tr>');
        return;
    }
    items.forEach(med => {
        $tbody.append(`
            <tr>
                <td>${med.id}</td>
                <td>${med.nombre}</td>
                <td>${med.categoria}</td>
                <td>${med.cantidad}</td>
                <td>${new Date(med.fecha_expiracion).toISOString().slice(0,10)}</td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-warning me-1" onclick="editar(${med.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminar(${med.id})">Eliminar</button>
                </td>
            </tr>`);
    });
}

// Se obtiene medicamentos desde la API con filtros opcionales
async function fetchMedicamentos(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}${query ? '?' + query : ''}`);
    return await res.json();
}

// Carga todos los medicamentos
async function cargar() {
    const data = await fetchMedicamentos();
    renderRows(data);
}

// Busca medicamentos según filtros ingresados
async function buscar() {
    const nombre = $('#filtroNombre').val().trim();
    const categoria = $('#filtroCategoria').val().trim();
    const expira = $('#filtroExpira').val();
    const params = {};
    if (nombre) params.nombre = nombre;
    if (categoria) params.categoria = categoria;
    if (expira) params.expira_antes = expira;
    const data = await fetchMedicamentos(params);
    renderRows(data);
}

// Botones de búsqueda y recarga
$('#btnBuscar').on('click', (e) => {e.preventDefault(); buscar(); });
$('#btnRefrescar').on('click', (e) => {e.preventDefault(); cargar(); });


// Limpia el formulario
$('#btnLimpiar').on('click', () => {
    $('#id').val('');
    $('#formMedicamento')[0].reset();
    $('#nombre').focus();
});

// Envía el formulario (crear o actualizar medicamento)
$('#formMedicamento').on('submit', async function(e) {
    e.preventDefault();
    const body = {
        nombre: $('#nombre').val().trim(),
        categoria: $('#categoria').val().trim(),
        cantidad: parseInt($('#cantidad').val(), 10),
        fecha_expiracion: $('#fecha_expiracion').val(),
    };
    const id = $('#id').val();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/${id}` : API_BASE;

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res .json().catch(() => ({ error: 'Error'}));
        alert(err.error || 'Error al guardar');
        return;
    }
    await cargar();
    $('#formMedicamento')[0].reset();
    $('#id').val('');
});

// Carga los datos del medicamento seleccionado en el formulario
async function editar(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) return alert('No encontrado');
    const med = await res.json();
    $('#id').val(med.id);
    $('#nombre').val(med.nombre);
    $('#categoria').val(med.categoria);
    $('#cantidad').val(med.cantidad);
    $('#fecha_expiracion').val(new Date(med.fecha_expiracion).toISOString().slice(0,10));
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Elimina un medicamento
async function eliminar (id) {
    if (!confirm('¿Eliminar este medicamento?')) return;
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('No se pudo eliminar');
    await cargar();
}

// Carga inicial al abrir la página
document.addEventListener('DOMContentLoaded', cargar);
