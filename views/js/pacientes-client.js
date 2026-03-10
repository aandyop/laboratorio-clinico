const pacienteForm = document.getElementById('paciente-form');
const selectMedicos = document.getElementById('medico_id');
const tableBody = document.querySelector('#pacientes-table tbody');

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

async function cargarSelectMedicos() {
    try {
        const res = await fetch('/api/medicos', { headers: getHeaders() });
        const medicos = await res.json();

        selectMedicos.innerHTML = '<option value="">-- Seleccione Médico (Opcional) --</option>';
        
        medicos.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.nombre;
            selectMedicos.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar select de médicos:", error);
    }
}

async function cargarPacientes() {
    try {
        const res = await fetch('/api/pacientes', { headers: getHeaders() });
        
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/login';
            return;
        }

        const pacientes = await res.json();
        
        tableBody.innerHTML = '';
        pacientes.forEach(p => {
            const btnEliminar = localStorage.getItem('rol') === 'ADMIN' 
                ? `<button onclick="eliminarPaciente(${p.id})" class="btn-delete">Eliminar</button>` 
                : '';

            tableBody.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.cedula}</td>
                    <td>${p.telefono}</td>
                    <td>${p.medico_nombre || 'Sin asignar'}</td>
                    <td>${btnEliminar}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar la lista de pacientes:", error);
        tableBody.innerHTML = '<tr><td colspan="5">Error al cargar datos</td></tr>';
    }
}

pacienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        nombre: document.getElementById('nombre').value,
        cedula: document.getElementById('cedula').value,
        telefono: document.getElementById('telefono').value,
        medico_id: selectMedicos.value || null 
    };

    try {
        const response = await fetch('/api/pacientes', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Paciente guardado");
            pacienteForm.reset();
            cargarPacientes();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    } catch (error) {
        alert("Error al guardar paciente");
    }
});

async function eliminarPaciente(id) {
    if (confirm('¿Eliminar paciente y sus exámenes?')) {
        try {
            const response = await fetch(`/api/pacientes/${id}`, { 
                method: 'DELETE',
                headers: getHeaders() 
            });

            if (response.ok) {
                cargarPacientes();
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

async function inicializar() {
    await cargarSelectMedicos();
    await cargarPacientes();
}

inicializar();