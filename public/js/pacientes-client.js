const form = document.getElementById('paciente-form');
const tableBody = document.querySelector('#pacientes-table tbody');

// 1. Cargar pacientes al abrir la página (GET)
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

// 2. Guardar paciente (POST)
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

// 3. Eliminar paciente (DELETE) - *Debes agregar la ruta DELETE en tu backend para que esto funcione
async function eliminarPaciente(id) {
    if(confirm('¿Seguro que deseas eliminarlo?')) {
        // Aquí llamarías a tu endpoint DELETE
        alert('Botón configurado para el ID: ' + id);
    }
}

cargarPacientes();