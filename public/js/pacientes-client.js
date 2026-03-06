const form = document.getElementById('paciente-form');
const tableBody = document.querySelector('#pacientes-table tbody');

async function cargarPacientes() {
    const response = await fetch('/api/pacientes');
    const pacientes = await response.json();
    
    tableBody.innerHTML = '';
    pacientes.forEach(p => {
        tableBody.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.cedula}</td>
                <td>${p.telefono}</td>
                <td>
                    <button onclick="eliminarPaciente(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        nombre: document.getElementById('nombre').value,
        cedula: document.getElementById('cedula').value,
        telefono: document.getElementById('telefono').value
    };

    await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    form.reset();
    cargarPacientes();
});

async function eliminarPaciente(id) {
    if (confirm('¿Estás seguro de eliminar este paciente? Se borrarán todos sus exámenes asociados automáticamente.')) {
        try {
            const response = await fetch(`/api/pacientes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Paciente y sus exámenes eliminados con éxito');
                cargarPacientes();
            } else {
                alert('Error al eliminar el paciente');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al servidor');
        }
    }
}

cargarPacientes();